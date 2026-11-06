import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { createHelper } from './compose-helper.mjs';

test('persistence_twice_and_cleanup', { concurrency: false }, async t => {
  const helper = createHelper();
  await helper.withLock(async ({ signal }) => {
    const sql = (input, variables) => helper.compose([
      'exec', '-T', 'database', 'sh', '-c',
      'exec psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 -At "$@"',
      'psql', ...Object.entries(variables).flatMap(([key, value]) => ['-v', `${key}=${value}`]),
    ], { input }).stdout.trim();
    const database = () => helper.assertTestEnvironmentOwned().resources.find(r => r.kind === 'container' && r.labels['com.docker.compose.service'] === 'database');
    for (let cycle = 1; cycle <= 2; cycle++) {
      const schema = `s01_probe_${randomUUID().replaceAll('-', '')}`;
      const marker = randomUUID();
      const variables = { probe_schema: schema, marker };
      const failures = [];
      let created = false;
      helper.recordRecovery({ schema, services: ['database'] });
      try {
        sql('BEGIN;\nCREATE SCHEMA :"probe_schema";\nCREATE TABLE :"probe_schema".probes (id text PRIMARY KEY);\nINSERT INTO :"probe_schema".probes VALUES (:\'marker\');\nCOMMIT;\n', variables);
        created = true;
        const before = database();
        const beforeVolume = before.mounts[0].Name;
        helper.compose(['up', '-d', '--no-deps', '--force-recreate', '--wait', '--wait-timeout', '120', 'database']);
        const after = database();
        assert.notEqual(before.id, after.id);
        assert.equal(beforeVolume, after.mounts[0].Name);
        assert.equal(sql('SELECT id FROM :"probe_schema".probes;\n', variables), marker);
        let healthy = false;
        for (let attempt = 0; attempt < 60; attempt++) {
          try { healthy = helper.httpViaProxy('/api/health').status === 200; } catch { /* reconnect */ }
          if (healthy) break;
          await delay(500, undefined, { signal });
        }
        assert.equal(healthy, true);
        t.diagnostic(`Cycle ${cycle}: different container, same owned volume ${beforeVolume}, marker retained; DB IP ${before.networks[`${helper.project}_data`].IPAddress} / ${after.networks[`${helper.project}_data`].IPAddress}`);
      } catch (error) {
        failures.push(error);
      } finally {
        try {
          await helper.restore(async () => {
            helper.assertTestEnvironmentOwned();
            helper.compose(['up', '-d', '--no-deps', '--wait', '--wait-timeout', '120', 'database']);
            if (created) sql('DROP SCHEMA :"probe_schema" CASCADE;\n', variables);
            assert.equal(sql('SELECT count(*) FROM pg_namespace WHERE nspname = :\'probe_schema\';\n', variables), '0', 'Unconfirmed schema ownership; retain recovery journal for inspection');
            helper.clearRecovery({ schema, services: ['database'] });
          });
        } catch (error) {
          failures.push(new Error(`Cleanup failed for owned synthetic schema ${schema}`, { cause: error }));
        }
      }
      if (failures.length) throw new AggregateError(failures, `Persistence cycle ${cycle} failed; no volume was removed`);
    }
  });
});
