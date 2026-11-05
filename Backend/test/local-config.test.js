import test from 'node:test';
import assert from 'node:assert/strict';
import { readLocalConfig } from '../src/local-config.js';

test('local catalog starts with no PostgreSQL configuration', () => {
  assert.deepEqual(readLocalConfig({}), { port: 3000, database: null });
  assert.deepEqual(readLocalConfig({ PGUSER: '', PGPASSWORD: '', PGDATABASE: '' }).database, null);
});
test('partial PostgreSQL configuration fails without printing values', () => {
  assert.throws(() => readLocalConfig({ PGUSER: 'local-user', PGPASSWORD: 'sensitive-marker' }), error => {
    assert.match(error.message, /PGDATABASE/);
    assert.equal(error.message.includes('sensitive-marker'), false);
    return true;
  });
});
test('configured PostgreSQL defaults to loopback and preserves password', () => {
  const config = readLocalConfig({ PGUSER: 'local-user', PGPASSWORD: '  local-pass  ', PGDATABASE: 'local-db' });
  assert.equal(config.database.host, '127.0.0.1');
  assert.equal(config.database.port, 5432);
  assert.equal(config.database.password, '  local-pass  ');
});
test('local port validation also applies while DB is absent', () => {
  for (const PORT of ['0', '65536', '', 'invalid', '3000.5']) assert.throws(() => readLocalConfig({ PORT }), /PORT/);
  assert.equal(readLocalConfig({ PORT: '3001' }).port, 3001);
});
