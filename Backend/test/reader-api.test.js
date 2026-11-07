import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { writeFile, readFile, symlink, rm } from 'node:fs/promises';
import request from 'supertest';
import { fixture } from './helpers/reader.js';
import { importChapter } from '../src/reader/importer.js';
import { createReaderRepository } from '../src/reader/repository.js';
import { createDemoCatalogRepository } from '../src/catalog/demo-repository.js';
import { createApp } from '../src/app.js';

const api = '/api/works/archivo-aurora/chapters';
async function setup(t) {
  const f = await fixture(t); await writeFile(path.join(f.input, '1.png'), f.png);
  for (const number of ['10', '1', '2']) await importChapter({ ...f.options, number });
  const readerRepository = createReaderRepository({ root: f.options.root });
  const app = createApp({ readerRepository, catalogRepository: createDemoCatalogRepository(), checkDatabase: async () => { throw Error('no PG'); }, logger: { error() {} } });
  return { ...f, app };
}
test('chapter API is numerically ordered and discloses no private authorization metadata', async t => {
  const { app, options } = await setup(t);
  const res = await request(app).get(api).expect(200);
  assert.deepEqual(res.body.chapters.map(c => c.number), ['1', '2', '10']);
  assert.equal(res.body.work.id, 'archivo-aurora');
  assert.deepEqual(res.body.source, { kind: 'local-manifest', configured: true });
  const json = JSON.stringify(res.body);
  for (const secret of [options.root, options.source, 'proofHash', 'storeId', 'transactionId', 'rights']) assert.ok(!json.includes(secret));
  assert.equal(res.headers['cache-control'], 'no-store'); assert.equal(res.headers['x-content-type-options'], 'nosniff');
  assert.equal(res.headers['access-control-allow-origin'], undefined);
});
test('chapter detail supplies real previous/next boundaries and controlled page metadata', async t => {
  const { app } = await setup(t);
  for (const [n, prev, next] of [['1', null, '2'], ['2', '1', '10'], ['10', '2', null]]) {
    const { body } = await request(app).get(`${api}/${n}`).expect(200);
    assert.equal(body.previous, prev); assert.equal(body.next, next);
    assert.equal(body.chapter.number, n); assert.deepEqual(body.pages, [{ index: 1, width: 48, height: 96 }]);
  }
});
test('page endpoint sends only validated PNG bytes, including safe HEAD headers', async t => {
  const { app, png } = await setup(t);
  const res = await request(app).get(`${api}/1/pages/1`).expect(200).expect('Content-Type', /image\/png/);
  assert.deepEqual(res.body, png); assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(res.headers['cross-origin-resource-policy'], 'same-origin');
  await request(app).head(`${api}/1/pages/1`).expect(200).expect('Cache-Control', 'no-store');
});
test('reader routes reject malformed IDs, numbers and page indices, and unknown data', async t => {
  const { app } = await setup(t);
  for (const url of ['/api/works/unknown/chapters', `${api}/3`, `${api}/01`, `${api}/-1`, `${api}/1/pages/0`, `${api}/1/pages/2`, `${api}/1/pages/01`, `${api}/1/pages/1.png`]) await request(app).get(url).expect(404);
});
test('reader is GET-only and rejects DNS rebinding Hosts without changing catalog/health', async t => {
  const { app } = await setup(t);
  await request(app).post(api).send({ url: 'https://example.invalid/image' }).expect(405);
  await request(app).get(api).set('Host', 'evil.example').expect(403).expect('Cache-Control', 'no-store');
  await request(app).get(api).set('Host', 'localhost.evil.example').expect(403);
  await request(app).get('/api/works').expect(200);
  await request(app).get('/api/health').expect(503);
});
test('unconfigured reader is honestly empty; bad store fails closed without affecting catalog', async () => {
  const create = root => createApp({ readerRepository: createReaderRepository({ root }), catalogRepository: createDemoCatalogRepository(), checkDatabase: async () => {}, logger: { error() {} } });
  const empty = await request(create()).get(api).expect(200);
  assert.deepEqual(empty.body.chapters, []); assert.equal(empty.body.source.configured, false);
  const broken = create('/tmp/yitverse-nonexistent-reader-store');
  await request(broken).get(api).expect(503).expect({ error: 'reader_unavailable' });
  await request(broken).get('/api/works').expect(200);
});
test('tampered manifest, private proof and page data fail closed without leaking paths', async t => {
  const { app, options } = await setup(t);
  const directory = path.join(options.root, 'chapters/archivo-aurora/1');
  const manifestFile = path.join(directory, 'manifest.json'), original = await readFile(manifestFile);
  await writeFile(manifestFile, JSON.stringify({ ...JSON.parse(original), workId: 'another-work' }));
  await request(app).get(api).expect(503).expect({ error: 'reader_unavailable' });
  await writeFile(manifestFile, original);
  await writeFile(path.join(directory, 'authorization.bin'), 'invalid');
  await request(app).get(api).expect(503);
  await writeFile(path.join(directory, 'authorization.bin'), await readFile(options.proof));
  await writeFile(path.join(directory, '0001.png'), 'invalid');
  const res = await request(app).get(`${api}/1/pages/1`).expect(503);
  assert.deepEqual(res.body, { error: 'reader_unavailable' });
});
test('page serving rejects symlinks, and technical S01 app exposes no reader', async t => {
  const { app, options, input } = await setup(t);
  const page = path.join(options.root, 'chapters/archivo-aurora/1/0001.png');
  await rm(page); await symlink(path.join(input, '1.png'), page);
  await request(app).get(`${api}/1/pages/1`).expect(503);
  await request(createApp({ checkDatabase: async () => {} })).get(api).expect(404);
});

test('incomplete published chapter cannot expose detail or pages', async t => {
  const { app, options } = await setup(t);
  await rm(path.join(options.root, 'chapters/archivo-aurora/1/READY'));
  await request(app).get(`${api}/1`).expect(503);
  await request(app).get(`${api}/1/pages/1`).expect(503);
});
