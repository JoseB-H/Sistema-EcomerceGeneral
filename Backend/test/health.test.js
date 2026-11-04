import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

test('healthy_depends_on_database: each response awaits a real check dependency', async () => {
  let calls = 0;
  const app = createApp({ checkDatabase: async () => { calls++; } });
  for (let i = 0; i < 2; i++) {
    const response = await request(app).get('/api/health');
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { status: 'ok', database: 'ok' });
    assert.equal(response.headers['cache-control'], 'no-store');
  }
  assert.equal(calls, 2);
});

test('database_failure_is_sanitized', async () => {
  const logs = [];
  const app = createApp({
    checkDatabase: async () => { throw new Error('sensitive-test-marker'); },
    logger: { error: record => logs.push(record) },
  });
  const response = await request(app).get('/api/health');
  assert.equal(response.status, 503);
  assert.deepEqual(response.body, { status: 'degraded', database: 'unavailable' });
  assert.equal(response.headers['cache-control'], 'no-store');
  assert.equal(JSON.stringify({ response: response.body, logs }).includes('sensitive-test-marker'), false);
  assert.deepEqual(logs, [{ event: 'database_unavailable' }]);
});

test('unknown_api_is_404', async () => {
  const response = await request(createApp({ checkDatabase: async () => {} })).get('/api/unknown');
  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: 'not_found' });
});

test('waits_for_database_result', async () => {
  let release;
  let entered;
  const started = new Promise(resolve => { entered = resolve; });
  const pending = new Promise(resolve => { release = resolve; });
  const app = createApp({ checkDatabase: () => { entered(); return pending; } });
  let finished = false;
  const response = request(app).get('/api/health').then(value => { finished = true; return value; });
  await started;
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(finished, false);
  release();
  assert.equal((await response).status, 200);
});

test('unexpected_error_is_sanitized', async () => {
  let logs = 0;
  const app = createApp({
    checkDatabase: async () => { throw new Error('sensitive-test-marker'); },
    logger: { error: () => { if (++logs === 1) throw new Error('sensitive-test-marker'); } },
  });
  const response = await request(app).get('/api/health');
  assert.equal(response.status, 500);
  assert.deepEqual(response.body, { error: 'internal_error' });
});
