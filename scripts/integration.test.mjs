import test from 'node:test';
import assert from 'node:assert/strict';
import { createHelper } from './compose-helper.mjs';

test('compose_has_three_isolated_services', async () => {
  const helper = createHelper();
  await helper.withLock(async () => {
    const model = JSON.parse(helper.compose(['config', '--format', 'json']).stdout);
    assert.deepEqual(Object.keys(model.services).sort(), ['backend', 'database', 'frontend']);
    assert.deepEqual(Object.keys(model.services.frontend.networks), ['app']);
    assert.deepEqual(Object.keys(model.services.backend.networks).sort(), ['app', 'data']);
    assert.deepEqual(Object.keys(model.services.database.networks), ['data']);
    assert.equal(model.networks.data.internal, true);
    assert.equal(model.services.database.ports, undefined);
    assert.equal(model.services.backend.ports, undefined);
    assert.equal(model.services.frontend.ports[0].host_ip, '127.0.0.1');
    assert.equal(model.services.database.volumes[0].target, '/var/lib/postgresql/data');
    assert.equal(Object.keys(model.services.frontend.environment ?? {}).some(k => /^(PG|POSTGRES_)/.test(k)), false);
  });
});

test('backend_runtime_is_nonroot_and_readable', async () => {
  const helper = createHelper();
  await helper.withLock(async () => {
    const result = helper.compose(['exec', '-T', 'backend', 'node', '--input-type=module', '-e', 'import fs from "node:fs"; if(process.getuid()===0)process.exit(1); fs.readFileSync("/app/package.json"); console.log("readable");']);
    assert.equal(result.stdout.trim(), 'readable');
  });
});

test('frontend_healthcheck_reaches_local_nginx', async () => {
  const helper = createHelper();
  await helper.withLock(async () => {
    const { resources } = helper.assertTestEnvironmentOwned();
    const frontend = resources.find(r => r.labels['com.docker.compose.service'] === 'frontend');
    assert.equal(frontend.state.Health.Status, 'healthy');
  });
});
