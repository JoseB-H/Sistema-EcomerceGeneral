import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
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

test('S01 operational integration', { concurrency: false }, async t => {
  const helper = createHelper();
  await helper.withLock(async ({ signal }) => {
    const healthy = () => {
      const response = helper.httpViaProxy('/api/health');
      assert.equal(response.status, 200);
      assert.deepEqual(JSON.parse(response.body), { status: 'ok', database: 'ok' });
    };
    const recover = async waitSignal => {
      const until = Date.now() + 60000;
      let lastError;
      do {
        try { healthy(); return; } catch (error) { lastError = error; }
        await delay(500, undefined, { signal: waitSignal });
      } while (Date.now() < until);
      throw lastError;
    };
    const resource = name => helper.assertTestEnvironmentOwned().resources.find(r => r.kind === 'container' && r.labels['com.docker.compose.service'] === name);
    // This first request also ensures the probe exists before any service is stopped.
    healthy();
    await t.test('root_serves_compiled_react', () => {
      const response = helper.httpViaProxy('/');
      assert.equal(response.status, 200);
      assert.match(response.body, /id="root"/);
      const asset = response.body.match(/src="([^"]+\.js)"/)[1];
      assert.equal(helper.httpViaProxy(asset).status, 200);
    });
    await t.test('health_uses_real_database', () => {
      const response = helper.httpViaProxy('/api/health');
      assert.equal(response.headers['cache-control'], 'no-store');
      healthy();
    });
    await t.test('unknown_api_is_not_spa', () => {
      const response = helper.httpViaProxy('/api/unknown');
      assert.equal(response.status, 404);
      assert.deepEqual(JSON.parse(response.body), { error: 'not_found' });
    });
    await t.test('database_restart_recovers', async () => {
      const backendBefore = resource('backend').id;
      helper.recordRecovery({ services: ['database'] });
      try {
        helper.compose(['stop', '-t', '15', 'database']);
        const response = helper.httpViaProxy('/api/health');
        assert.equal(response.status, 503);
        assert.deepEqual(JSON.parse(response.body), { status: 'degraded', database: 'unavailable' });
      } finally {
        await helper.restore(async () => {
          helper.compose(['start', 'database']);
          await recover();
          helper.clearRecovery({ services: ['database'] });
        });
      }
      assert.equal(resource('backend').id, backendBefore);
    });
    await t.test('backend_stop_closes_cleanly', async () => {
      helper.recordRecovery({ services: ['backend'] });
      try {
        const before = Date.now();
        helper.compose(['stop', '-t', '15', 'backend']);
        assert.ok(Date.now() - before < 10000, 'Backend must close before its shutdown deadline');
        assert.equal(resource('backend').state.ExitCode, 0);
        const response = helper.compose(['exec', '-T', 'frontend', 'wget', '-Y', 'off', '-S', '-O', '/dev/null', 'http://127.0.0.1/api/health'], { allowFailure: true });
        assert.notEqual(response.status, 0);
        assert.match(response.stderr, /HTTP\/1\.[01] 50[24]/);
      } finally {
        await helper.restore(async () => {
          helper.compose(['start', 'backend']);
          await recover();
          helper.clearRecovery({ services: ['backend'] });
        });
      }
    });
    await t.test('backend_recreate_recovers_proxy', async () => {
      const before = resource('backend');
      const frontendId = resource('frontend').id;
      helper.recordRecovery({ services: ['backend'] });
      try {
        helper.compose(['up', '-d', '--no-deps', '--force-recreate', '--wait', '--wait-timeout', '120', 'backend']);
        await recover(signal);
        assert.notEqual(resource('backend').id, before.id);
        assert.equal(resource('frontend').id, frontendId);
        t.diagnostic(`Backend IP before/after: ${before.networks[`${helper.project}_app`].IPAddress} / ${resource('backend').networks[`${helper.project}_app`].IPAddress}`);
      } finally {
        await helper.restore(async () => {
          helper.compose(['start', 'backend']);
          await recover();
          helper.clearRecovery({ services: ['backend'] });
        });
      }
    });
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
