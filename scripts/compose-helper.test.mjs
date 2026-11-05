import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHelper, validateProject, validateArgs } from './compose-helper.mjs';

function fixture(t, { resources = [], record = true, daemon = 'unit-daemon', checkout } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'yitverse-helper-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, '.local'));
  const identity = { project: 'yitverse-s01-unit', checkoutRealPath: checkout ?? root, daemonId: 'unit-daemon', ownerId: 'test-owner' };
  if (record) writeFileSync(join(root, '.local/s01-test-environment.json'), JSON.stringify(identity));
  const calls = [];
  const helper = createHelper({
    root, env: { S01_COMPOSE_PROJECT: 'yitverse-s01-unit' },
    daemonReader: () => daemon, inventoryReader: () => resources,
    run: args => {
      calls.push(args);
      if (args.includes('config')) return { status: 0, stdout: JSON.stringify({
        services: { frontend: { networks: { app: {} }, labels: labels('frontend') }, backend: { networks: { app: {}, data: {} }, labels: labels('backend') }, database: { networks: { data: {} }, labels: labels('database'), volumes: [{ type: 'volume', source: 'postgres_data', target: '/var/lib/postgresql/data' }] } },
        networks: { app: { name: 'yitverse-s01-unit_app' }, data: { name: 'yitverse-s01-unit_data', internal: true } },
        volumes: { postgres_data: { name: 'yitverse-s01-unit_postgres_data' } },
      }), stderr: '' };
      return { status: 0, stdout: '', stderr: '' };
    },
  });
  return { helper, calls, identity };
}
function labels(service) {
  return { 'com.docker.compose.project': 'yitverse-s01-unit', 'com.docker.compose.service': service, 'io.yitverse.s01.purpose': 'test', 'io.yitverse.s01.owner': 'test-owner' };
}
test('rejects_invalid_project', () => {
  for (const value of ['', 'production', 'yitverse-s01/other', 'yitverse-s01;touch x']) assert.throws(() => validateProject(value));
  assert.equal(validateProject('yitverse-s01-clean'), 'yitverse-s01-clean');
});
test('rejects_identity_overrides and rejects_volume_deletion', () => {
  for (const args of [['-pother', 'stop'], ['--project-name=other', 'stop'], ['-f', 'other.yml', 'up'], ['--env-file=x', 'up'], ['--project-directory=x', 'up'], ['down', '-v'], ['down', '--volumes'], ['up', '--remove-orphans']]) {
    assert.throws(() => validateArgs(args));
  }
});
test('rejects_existing_unowned_environment before mutations', t => {
  const { helper, calls } = fixture(t, { record: false, resources: [{ kind: 'container', name: 'yitverse-s01-unit-database-1', labels: {} }] });
  assert.throws(() => helper.prepareTestEnvironment(), /ownership|propiedad/i);
  assert.equal(calls.length, 0);
});
test('rejects_foreign_volume_or_mount before mutations', t => {
  const { helper, calls } = fixture(t, { resources: [{ kind: 'container', name: 'db', labels: labels('database'), mounts: [{ Type: 'bind', Destination: '/var/lib/postgresql/data', Source: '/foreign' }] }] });
  assert.throws(() => helper.compose(['stop', 'database']), /volume|mount|volumen/i);
  assert.equal(calls.length, 0);
});
test('rejects_foreign_volume_owner before mutations', t => {
  const { helper, calls } = fixture(t, { resources: [{ kind: 'volume', name: 'yitverse-s01-unit_postgres_data', labels: { ...labels(), 'io.yitverse.s01.owner': 'other-owner' } }] });
  assert.throws(() => helper.compose(['up', '-d']), /ownership|propiedad/i);
  assert.equal(calls.length, 0);
});
test('rejects_checkout_or_daemon_mismatch', t => {
  for (const options of [{ daemon: 'different-daemon' }, { checkout: '/another-checkout' }]) {
    const { helper, calls } = fixture(t, options);
    assert.throws(() => helper.compose(['up', '-d']), /identity|identidad/i);
    assert.equal(calls.length, 0);
  }
});
test('rejects_concurrent_operational_suite', async t => {
  const { helper } = fixture(t);
  const other = createHelper({ root: helper.root, env: { S01_COMPOSE_PROJECT: 'yitverse-s01-unit' }, daemonReader: () => 'unit-daemon', inventoryReader: () => [] });
  await helper.withLock(async () => {
    assert.throws(() => other.compose(['stop', 'database']), /lock|bloqueo/i);
    // Same-process operations must not reacquire their own suite lock.
    helper.assertTestEnvironmentOwned();
  });
});
test('accepts_owned_s01_environment', t => {
  const { helper, calls } = fixture(t);
  helper.compose(['up', '-d']);
  assert.equal(calls.length, 2);
  assert.ok(calls[1].includes('yitverse-s01-unit'));
  assert.ok(calls[1].includes(join(helper.root, '.local/compose.s01-tests.yml')));
});
