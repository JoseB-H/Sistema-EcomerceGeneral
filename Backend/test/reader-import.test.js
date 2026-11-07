import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, readFile, readdir, mkdir, symlink } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { fixture, zip } from './helpers/reader.js';
import { importChapter, recoverImport, importStatus } from '../src/reader/importer.js';
import { chapterNumber, compareChapters } from '../src/reader/validation.js';
import { openStore, withLock, unlockStore } from '../src/reader/store.js';
import { randomUUID } from 'node:crypto';
import { hostname } from 'node:os';

test('chapter numbers are canonical, bounded and sorted numerically', () => {
  assert.equal(chapterNumber('01.020'), '1.02');
  assert.equal(chapterNumber('1.000'), '1');
  assert.deepEqual(['10', '2', '1.5', '0'].sort(compareChapters), ['0', '1.5', '2', '10']);
  for (const bad of ['-1', '1e3', '../1', '1.0001', '1000000', '', 'Infinity']) assert.throws(() => chapterNumber(bad));
});

test('imports numeric pages without touching originals; proof stays private', async t => {
  const f = await fixture(t);
  for (const n of ['10', '2', '1']) await writeFile(path.join(f.input, `${n}.png`), f.png);
  const result = await importChapter(f.options);
  assert.equal(result.number, '1'); assert.equal(result.pageCount, 3);
  const dir = path.join(f.options.root, 'chapters/archivo-aurora/1');
  const manifest = JSON.parse(await readFile(path.join(dir, 'manifest.json')));
  assert.equal(manifest.pages.length, 3); assert.equal(manifest.rights.kind, 'own');
  assert.deepEqual(await readFile(path.join(f.input, '1.png')), f.png);
  assert.deepEqual((await readdir(f.input)).sort(), ['1.png', '10.png', '2.png']);
  assert.equal((await sharp(await readFile(path.join(dir, '0001.png'))).metadata()).format, 'png');
  await assert.rejects(importChapter({ ...f.options, number: '01.0' }), /duplicate/i);
  assert.deepEqual(await readFile(path.join(dir, '0001.png')), f.png);
});

test('adds later chapters and allows same number for another existing work', async t => {
  const f = await fixture(t); await writeFile(path.join(f.input, '1.png'), f.png);
  for (const n of ['1', '10', '2']) await importChapter({ ...f.options, number: n });
  await importChapter({ ...f.options, workId: 'orbita-de-papel' });
  assert.equal((await readdir(path.join(f.options.root, 'chapters/archivo-aurora'))).length, 3);
});

test('accepts JPEG and WebP by decoding and normalizing to PNG', async t => {
  const f = await fixture(t);
  for (const [extension, format] of [['jpg', 'jpeg'], ['webp', 'webp']]) {
    const input = path.join(f.base, `1.${extension}`);
    await writeFile(input, await sharp(f.png)[format]().toBuffer());
    await importChapter({ ...f.options, input, number: format === 'jpeg' ? '1' : '2' });
  }
});

test('accepts verified CBZ with numeric order and optional containing directory', async t => {
  const f = await fixture(t), input = path.join(f.base, 'chapter.cbz');
  await writeFile(input, zip([{ name: 'pages/', attributes: 0x41ed0010 }, { name: 'pages/10.png', data: f.png }, { name: 'pages/2.png', data: f.png }]));
  assert.equal((await importChapter({ ...f.options, input })).pageCount, 2);
});

test('accepts deflated ZIP and rejects excessive compression ratio before decoding', async t => {
  const f = await fixture(t), input = path.join(f.base, 'chapter.zip');
  await writeFile(input, zip([{ name: '1.png', data: f.png, method: 8 }]));
  await importChapter({ ...f.options, input });
  await writeFile(input, zip([{ name: '1.png', data: Buffer.alloc(65536), method: 8 }]));
  await assert.rejects(importChapter({ ...f.options, input, number: '2' }), /expansion/);
});

test('rejects missing rights, unknown works, foreign stores and roots inside Git', async t => {
  const f = await fixture(t); await writeFile(path.join(f.input, '1.png'), f.png);
  for (const options of [{ rights: 'unverified' }, { proof: path.join(f.base, 'absent') }, { source: '' }, { workId: 'unknown' }, { root: process.cwd() }]) {
    await assert.rejects(importChapter({ ...f.options, ...options }));
  }
  await mkdir(f.options.root); await writeFile(path.join(f.options.root, 'foreign.txt'), 'keep');
  await assert.rejects(importChapter(f.options), /store|empty/i);
  assert.equal(await readFile(path.join(f.options.root, 'foreign.txt'), 'utf8'), 'keep');
});

test('empty sandbox .git placeholder is not a repository; populated Git metadata is rejected', async t => {
  const f = await fixture(t); await writeFile(path.join(f.input, '1.png'), f.png);
  await mkdir(path.join(f.base, '.git'));
  await importChapter(f.options);
  await writeFile(path.join(f.base, '.git/HEAD'), 'ref: refs/heads/main');
  await assert.rejects(importChapter({ ...f.options, number: '2' }), /outside Git/);
});

test('source pages and authorization proofs must also stay outside Git', async t => {
  const f = await fixture(t), tracked = path.join(f.base, 'tracked');
  await mkdir(path.join(tracked, '.git'), { recursive: true });
  await writeFile(path.join(tracked, '.git/HEAD'), 'ref: refs/heads/main');
  await writeFile(path.join(tracked, '1.png'), f.png); await writeFile(path.join(f.input, '1.png'), f.png);
  await writeFile(path.join(tracked, 'proof.txt'), 'Do not version real publication proofs');
  await assert.rejects(importChapter({ ...f.options, input: tracked }), /outside Git/);
  await assert.rejects(importChapter({ ...f.options, proof: path.join(tracked, 'proof.txt') }), /outside Git/);
});

test('rejects disguised, truncated, nonnumeric and duplicate numeric pages', async t => {
  const f = await fixture(t);
  for (const [filename, bytes] of [['1.png', Buffer.from('<svg/>')], ['1.png', f.png.subarray(0, 30)], ['page.png', f.png]]) {
    const input = path.join(f.base, filename); await writeFile(input, bytes);
    await assert.rejects(importChapter({ ...f.options, input }));
  }
  await writeFile(path.join(f.input, '01.png'), f.png); await writeFile(path.join(f.input, '1.png'), f.png);
  await assert.rejects(importChapter(f.options), /duplicate/i);
});

test('rejects symlink inputs and symlink ancestors', async t => {
  const f = await fixture(t); await writeFile(path.join(f.input, '1.png'), f.png);
  const alias = path.join(f.base, 'alias'); await symlink(f.input, alias, 'dir');
  await assert.rejects(importChapter({ ...f.options, input: alias }), /link/i);
  await assert.rejects(importChapter({ ...f.options, input: path.join(alias, '1.png') }), /link/i);
});

test('enforces limits on source bytes, page count, pixels, proof and output', async t => {
  const f = await fixture(t); await writeFile(path.join(f.input, '1.png'), f.png);
  for (const limits of [{ imageBytes: 10 }, { pages: 0 }, { pixels: 10 }, { proofBytes: 10 }, { outputBytes: 10 }]) {
    await assert.rejects(importChapter(f.options, { limits }));
  }
});

for (const [label, entry] of [
  ['traversal', { name: '../1.png' }], ['absolute', { name: '/tmp/1.png' }], ['drive', { name: 'C:\\1.png' }],
  ['backslash', { name: 'pages\\1.png' }], ['encrypted', { name: '1.png', flags: 1 }],
  ['symlink', { name: '1.png', attributes: 0xa1ff0000 }], ['unknown file', { name: 'README.txt' }],
  ['CRC mismatch', { name: '1.png', checksum: 123 }], ['unsupported method', { name: '1.png', method: 99 }],
]) test(`rejects ZIP ${label} without publishing partial chapters`, async t => {
  const f = await fixture(t), input = path.join(f.base, 'chapter.zip');
  await writeFile(input, zip([{ data: f.png, ...entry }]));
  await assert.rejects(importChapter({ ...f.options, input }));
  await assert.rejects(readFile(path.join(f.options.root, 'chapters/archivo-aurora/1/manifest.json')));
});

test('ZIP entry count, archive size and expanded bytes are bounded', async t => {
  const f = await fixture(t), input = path.join(f.base, 'chapter.zip');
  await writeFile(input, zip([{ name: '1.png', data: f.png }, { name: '2.png', data: f.png }]));
  for (const limits of [{ entries: 1 }, { archiveBytes: 30 }, { expandedBytes: f.png.length }]) await assert.rejects(importChapter({ ...f.options, input }, { limits }));
});

test('interrupted ready transaction is invisible and explicitly recoverable', async t => {
  const f = await fixture(t); await writeFile(path.join(f.input, '1.png'), f.png);
  await assert.rejects(importChapter(f.options, { beforePublish: () => { throw new Error('simulated interruption'); } }), /interruption/);
  await assert.rejects(readFile(path.join(f.options.root, 'chapters/archivo-aurora/1/manifest.json')));
  const state = await importStatus(f.options.root);
  assert.equal(state.transactions.length, 1); assert.equal(state.transactions[0].ready, true);
  await recoverImport({ root: f.options.root, transaction: state.transactions[0].id, action: 'finish' });
  assert.equal((await importStatus(f.options.root)).transactions.length, 0);
  await assert.rejects(importChapter(f.options), /duplicate/i);
});

test('staging discard is explicit, owned and never removes committed chapters', async t => {
  const f = await fixture(t); await writeFile(path.join(f.input, '1.png'), f.png);
  await importChapter(f.options);
  await assert.rejects(importChapter({ ...f.options, number: '2' }, { beforePublish: () => { throw new Error('stop'); } }));
  const state = await importStatus(f.options.root);
  await assert.rejects(recoverImport({ root: f.options.root, transaction: '../chapters', action: 'discard' }));
  await recoverImport({ root: f.options.root, transaction: state.transactions[0].id, action: 'discard' });
  assert.ok(await readFile(path.join(f.options.root, 'chapters/archivo-aurora/1/manifest.json')));
});

test('concurrent imports cannot overwrite the same chapter and live locks cannot be removed', async t => {
  const f = await fixture(t); await writeFile(path.join(f.input, '1.png'), f.png);
  const store = await openStore(f.options.root, { create: true });
  await withLock(store, async () => {
    const state = await importStatus(f.options.root);
    await assert.rejects(unlockStore(f.options.root, state.lock.token), /running/i);
    await assert.rejects(importChapter(f.options), /locked/i);
  });
  const results = await Promise.allSettled([importChapter(f.options), importChapter(f.options)]);
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
  assert.equal(results.filter(r => r.status === 'rejected').length, 1);
});

test('recovery revalidates bytes and never replaces a destination created meanwhile', async t => {
  const f = await fixture(t); await writeFile(path.join(f.input, '1.png'), f.png);
  await assert.rejects(importChapter(f.options, { beforePublish: () => { throw Error('stop'); } }));
  const id = (await importStatus(f.options.root)).transactions[0].id;
  const stagedPage = path.join(f.options.root, '.staging', id, '0001.png');
  await writeFile(stagedPage, 'corrupt');
  await assert.rejects(recoverImport({ root: f.options.root, transaction: id, action: 'finish' }));
  await writeFile(stagedPage, f.png);
  await mkdir(path.join(f.options.root, 'chapters/archivo-aurora/1'), { recursive: true });
  await assert.rejects(recoverImport({ root: f.options.root, transaction: id, action: 'finish' }), /duplicate/i);
  assert.equal((await readdir(path.join(f.options.root, 'chapters/archivo-aurora/1'))).length, 0);
});

test('rejects ZIP local/central header disagreement', async t => {
  const f = await fixture(t), input = path.join(f.base, 'chapter.zip');
  const bytes = zip([{ name: '1.png', data: f.png }]);
  bytes.write('2.png', 30);
  await writeFile(input, bytes);
  await assert.rejects(importChapter({ ...f.options, input }));
});

test('rejects ZIP mismatched local CRC without a data descriptor', async t => {
  const f = await fixture(t), input = path.join(f.base, 'chapter.zip');
  const bytes = zip([{ name: '1.png', data: f.png }]); bytes.writeUInt32LE(123, 14);
  await writeFile(input, bytes); await assert.rejects(importChapter({ ...f.options, input }));
});

test('status isolates incomplete staging; discard refuses unverifiable ownership', async t => {
  const f = await fixture(t); await openStore(f.options.root, { create: true });
  const id = randomUUID(); await mkdir(path.join(f.options.root, '.staging', id));
  const state = await importStatus(f.options.root);
  assert.deepEqual(state.transactions, [{ id, ready: false, state: 'unverified' }]);
  await assert.rejects(recoverImport({ root: f.options.root, transaction: id, action: 'discard' }));
});

test('unlock can resume after its own stale-lock archival, but refuses different bytes', async t => {
  const f = await fixture(t), store = await openStore(f.options.root, { create: true });
  const token = randomUUID(), lock = { token, storeId: store.storeId, pid: 2147483647, hostname: hostname() };
  const file = path.join(f.options.root, '.import.lock'), archive = path.join(f.options.root, `.stale-lock-${token}.json`);
  await writeFile(file, JSON.stringify(lock)); await writeFile(archive, JSON.stringify(lock));
  await unlockStore(f.options.root, token);
  assert.equal((await importStatus(f.options.root)).lock, null);
  await writeFile(file, JSON.stringify(lock)); await writeFile(archive, JSON.stringify({ ...lock, pid: 2 }));
  await assert.rejects(unlockStore(f.options.root, token));
  assert.equal(JSON.parse(await readFile(file)).token, token);
});

test('status reports a truncated lock without hiding transactions or forcing unlock', async t => {
  const f = await fixture(t); await openStore(f.options.root, { create: true });
  await writeFile(path.join(f.options.root, '.import.lock'), '{');
  assert.deepEqual((await importStatus(f.options.root)).lock, { state: 'unverified' });
  await assert.rejects(unlockStore(f.options.root, randomUUID()));
});
