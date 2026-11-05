import { test, expect } from 'vitest';
import { createCatalogApi } from '../src/catalog/catalog-client.js';
import { collection, detail } from './catalog-fixtures.js';

test('catalog client encodes search and forwards cancellation through relative API', async () => {
  let args;
  const signal = new AbortController().signal;
  const api = createCatalogApi(async (...received) => { args = received; return Response.json(collection); });
  expect(await api.list({ query: 'órbita & luz', format: 'manhwa', signal })).toEqual(collection);
  expect(args[0]).toBe('/api/works?q=%C3%B3rbita+%26+luz&format=manhwa');
  expect(args[1]).toEqual({ cache: 'no-store', signal });
});
test('detail requests and validates the selected work', async () => {
  const api = createCatalogApi(async url => { expect(url).toBe('/api/works/archivo-aurora'); return Response.json(detail); });
  expect(await api.detail('archivo-aurora', {})).toEqual(detail);
});
test('missing detail preserves not_found without exposing remote text', async () => {
  const api = createCatalogApi(async () => new Response('sensitive remote text', { status: 404 }));
  await expect(api.detail('no-existe', {})).rejects.toMatchObject({ code: 'not_found' });
});
for (const payload of [{}, { source: { kind: 'postgresql', persisted: true }, items: [] }, { ...collection, items: [{}] }, { ...collection, items: [collection.items[0], collection.items[0]] }]) {
  test(`invalid catalog JSON is rejected ${JSON.stringify(payload).slice(0, 40)}`, async () => {
    const api = createCatalogApi(async () => Response.json(payload));
    await expect(api.list({})).rejects.toMatchObject({ code: 'invalid_response' });
  });
}
test('HTML, network failure and 503 do not produce invented works', async () => {
  for (const fetchImpl of [async () => new Response('<html>offline</html>'), async () => new Response('offline', { status: 503 }), async () => { throw new Error('offline'); }]) {
    await expect(createCatalogApi(fetchImpl).list({})).rejects.toThrow();
  }
});
