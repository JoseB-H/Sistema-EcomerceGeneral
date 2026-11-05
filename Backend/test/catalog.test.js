import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createDemoCatalogRepository } from '../src/catalog/demo-repository.js';

const source = { kind: 'synthetic', persisted: false };
function app(repository = createDemoCatalogRepository()) {
  return createApp({ catalogRepository: repository, checkDatabase: async () => { throw new Error('Database not configured'); }, logger: { error() {} } });
}

test('catalog lists only synthetic data without pretending PostgreSQL is connected', async () => {
  const server = app();
  const response = await request(server).get('/api/works');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.source, source);
  assert.equal(response.body.items.length, 6);
  assert.equal(response.body.items[0].title, 'Archivo Aurora');
  assert.equal(response.headers['cache-control'], 'no-store');
  const health = await request(server).get('/api/health');
  assert.equal(health.status, 503);
  assert.equal(health.body.database, 'unavailable');
});

test('catalog search ignores case and accents and combines with format', async () => {
  const response = await request(app()).get('/api/works').query({ q: '  órbita  ', format: 'manhwa' });
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.items.map(item => item.id), ['orbita-de-papel']);
});

test('unmatched search returns a genuine empty collection', async () => {
  const response = await request(app()).get('/api/works').query({ q: 'zzzz-no-result' });
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.items, []);
  assert.deepEqual(response.body.source, source);
});

test('detail resolves an existing work and reports absence with 404', async () => {
  const found = await request(app()).get('/api/works/archivo-aurora');
  assert.equal(found.status, 200);
  assert.equal(found.body.item.title, 'Archivo Aurora');
  assert.ok(found.body.item.synopsis.length > 40);
  assert.deepEqual(found.body.source, source);
  const absent = await request(app()).get('/api/works/no-existe');
  assert.equal(absent.status, 404);
  assert.equal(absent.body.error, 'work_not_found');
});

for (const query of ['q=a&q=b', 'q%5Ba%5D=b', `q=${'x'.repeat(101)}`, 'format=unknown', 'format=manga&format=manhwa', 'q=%00', 'unsafe=x']) {
  test(`rejects invalid scalar catalog query: ${query.slice(0, 35)}`, async () => {
    const response = await request(app()).get(`/api/works?${query}`);
    assert.equal(response.status, 400);
    assert.deepEqual(response.body, { error: 'invalid_catalog_query' });
  });
}

test('rejects invalid detail identifiers without revealing internals', async () => {
  const response = await request(app()).get('/api/works/INVALID');
  assert.equal(response.status, 400);
  assert.deepEqual(response.body, { error: 'invalid_work_id' });
});

test('provider failures are sanitized for list and detail', async () => {
  const broken = { source, list: async () => { throw new Error('sensitive-provider-marker'); }, findById: async () => { throw new Error('sensitive-provider-marker'); } };
  for (const path of ['/api/works', '/api/works/archivo-aurora']) {
    const response = await request(app(broken)).get(path);
    assert.equal(response.status, 503);
    assert.deepEqual(response.body, { error: 'catalog_unavailable' });
    assert.equal(JSON.stringify(response.body).includes('sensitive-provider-marker'), false);
  }
});

test('read-only repository cannot be mutated through a returned record', async () => {
  const repository = createDemoCatalogRepository();
  const items = await repository.list({ query: '', format: '' });
  items[0].title = 'Changed outside repository';
  items[0].genres.push('Changed genre');
  const fresh = await repository.findById('archivo-aurora');
  assert.equal(fresh.title, 'Archivo Aurora');
  assert.equal(fresh.genres.includes('Changed genre'), false);
});
