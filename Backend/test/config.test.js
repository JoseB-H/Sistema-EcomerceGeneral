import test from 'node:test';
import assert from 'node:assert/strict';
import { readConfig } from '../src/config.js';

const valid = { PGUSER: 'probe', PGPASSWORD: '  synthetic-password  ', PGDATABASE: 'probe' };
test('defaults_and_password_are_preserved', () => {
  assert.deepEqual(readConfig(valid), {
    port: 3000,
    database: { host: 'database', port: 5432, user: 'probe', password: '  synthetic-password  ', database: 'probe' },
  });
  assert.equal(readConfig({ ...valid, PORT: '3001', PGPORT: '5433' }).port, 3001);
});
for (const name of ['PGUSER', 'PGPASSWORD', 'PGDATABASE', 'PGHOST']) {
  test(`rejects_empty_${name}_without_exposing_values`, () => {
    assert.throws(() => readConfig({ ...valid, [name]: '' }), new RegExp(name));
  });
}
for (const name of ['PORT', 'PGPORT']) {
  for (const value of ['', '0', '65536', '12.5', '3oops', '-1']) {
    test(`rejects_invalid_${name}_${value || 'empty'}`, () => {
      assert.throws(() => readConfig({ ...valid, [name]: value }), new RegExp(name));
    });
  }
}
