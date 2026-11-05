import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:net';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';

test('native runtime serves catalog and health 503 without PostgreSQL and releases its local port', { timeout: 15000 }, async t => {
  const reservation = createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const child = spawn(process.execPath, ['src/dev-server.js'], {
    cwd: import.meta.dirname + '/..',
    env: { ...process.env, PORT: String(port), PGUSER: '', PGPASSWORD: '', PGDATABASE: '' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const closed = once(child, 'exit');
  t.after(() => { if (child.exitCode === null) child.kill(); });
  let output = '';
  child.stdout.on('data', chunk => { output += chunk; });
  child.stderr.on('data', chunk => { output += chunk; });
  for (let attempt = 0; attempt < 60 && !output.includes('local_listening') && child.exitCode === null; attempt++) await delay(50);
  assert.match(output, /local_listening/, output);
  const list = await fetch(`http://127.0.0.1:${port}/api/works`);
  assert.equal(list.status, 200);
  assert.equal((await list.json()).source.kind, 'synthetic');
  const health = await fetch(`http://127.0.0.1:${port}/api/health`);
  assert.equal(health.status, 503);
  assert.deepEqual(await health.json(), { status: 'degraded', database: 'unavailable' });
  child.kill('SIGTERM');
  const [code] = await closed;
  // Windows force-terminates child.kill signals; console Ctrl+C is a separate native path.
  if (process.platform !== 'win32') assert.equal(code, 0);
  const reused = createServer();
  reused.listen(port, '127.0.0.1');
  await once(reused, 'listening');
  await new Promise(resolve => reused.close(resolve));
});
