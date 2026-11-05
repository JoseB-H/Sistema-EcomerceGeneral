import { test, expect } from 'vitest';
import { getHealth } from '../src/health-client.js';

test('uses_relative_health_route and forwards_abort_signal', async () => {
  const signal = new AbortController().signal;
  let received;
  const result = await getHealth({ signal, fetchImpl: async (...args) => {
    received = args;
    return new Response(JSON.stringify({ status: 'ok', database: 'ok' }));
  } });
  expect(received).toEqual(['/api/health', { cache: 'no-store', signal }]);
  expect(result).toEqual({ status: 'ok', database: 'ok' });
});
for (const [status, body] of [[503, '{"status":"degraded","database":"unavailable"}'], [502, '<html>failed</html>'], [200, '{}'], [200, '{'], [200, '{"status":"ok","database":"unavailable"}']]) {
  test(`rejects_invalid_health_response ${status} ${body}`, async () => {
    await expect(getHealth({ fetchImpl: async () => new Response(body, { status }) })).rejects.toThrow();
  });
}
test('rejects_network_error', async () => {
  await expect(getHealth({ fetchImpl: async () => { throw new TypeError('offline'); } })).rejects.toThrow();
});
