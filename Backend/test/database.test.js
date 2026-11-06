import test from 'node:test';
import assert from 'node:assert/strict';
import { createDatabaseCheck, createPool } from '../src/database.js';

test('checks_select_one', async () => {
  const sql = [];
  const check = createDatabaseCheck({ query: async text => { sql.push(text); return { rows: [{ ok: 1 }] }; } });
  await check();
  assert.deepEqual(sql, ['SELECT 1 AS ok']);
});
test('rejects_database_error', async () => {
  const check = createDatabaseCheck({ query: async () => { throw new Error('offline'); } });
  await assert.rejects(check, /offline/);
});
test('rejects_unexpected_query_result', async () => {
  for (const rows of [[], [{ ok: 0 }], [{ ok: 1 }, { ok: 1 }]]) {
    await assert.rejects(createDatabaseCheck({ query: async () => ({ rows }) }));
  }
});
test('idle_database_error_is_sanitized_and_does_not_crash', async t => {
  const logs = [];
  t.mock.method(console, 'error', event => logs.push(event));
  const pool = createPool({ host: 'database', port: 5432, user: 'probe', password: 'probe', database: 'probe' });
  assert.doesNotThrow(() => pool.emit('error', new Error('sensitive-test-marker')));
  assert.deepEqual(logs, [{ event: 'database_idle_error' }]);
  await pool.end();
});
