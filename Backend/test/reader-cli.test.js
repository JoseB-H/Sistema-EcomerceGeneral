import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { writeFile, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fixture } from './helpers/reader.js';
import { createReaderRepository } from '../src/reader/repository.js';

test('CLI imports locally, gives useful duplicate error without private path and offers no URL option', async t => {
  const f = await fixture(t); await writeFile(path.join(f.input, '1.png'), f.png);
  const args = ['scripts/import-chapter.mjs', 'import', '--root', f.options.root, '--work', f.options.workId, '--number', '1', '--input', f.input, '--rights', 'own', '--source', f.options.source, '--authorization', f.proof];
  const imported = JSON.parse(execFileSync(process.execPath, args, { encoding: 'utf8' }));
  assert.equal(imported.pageCount, 1);
  const duplicate = spawnSync(process.execPath, args, { encoding: 'utf8' });
  assert.equal(duplicate.status, 1); assert.match(duplicate.stderr, /Duplicate chapter/i);
  assert.ok(!duplicate.stderr.includes(f.base));
  const url = spawnSync(process.execPath, ['scripts/import-chapter.mjs', 'import', '--root', f.options.root, '--url', 'https://example.invalid/1.png'], { encoding: 'utf8' });
  assert.equal(url.status, 1); assert.ok(!url.stderr.includes('example.invalid'));
});

test('demo script creates nine original pages outside Git and cannot overwrite a previous run', async t => {
  const f = await fixture(t), output = path.join(f.base, 'original-demo');
  const args = ['scripts/generate-reader-demo.mjs', '--output', output, '--root', f.options.root];
  execFileSync(process.execPath, args, { encoding: 'utf8', timeout: 20000 });
  const repository = createReaderRepository({ root: f.options.root });
  const chapters = await repository.list('orbita-de-papel');
  assert.deepEqual(chapters.map(c => c.number), ['1', '2', '10']);
  assert.ok(chapters.every(c => c.pageCount === 3));
  assert.equal((await readdir(path.join(output, 'chapter-1'))).length, 3);
  const page = await readFile(path.join(output, 'chapter-1/1.png'));
  assert.ok(page.length > 1000);
  const again = spawnSync(process.execPath, args, { encoding: 'utf8' });
  assert.equal(again.status, 1);
  assert.deepEqual(await readFile(path.join(output, 'chapter-1/1.png')), page);
});
