import { test, expect, vi } from 'vitest';
import { createReaderApi, chapterHref } from '../src/reader/reader-client.js';
export const chapterList = { work: { id: 'archivo-aurora', title: 'Archivo Aurora' }, source: { kind: 'local-manifest', configured: true }, chapters: ['1', '2', '10'].map(number => ({ number, title: `Relato original ${number}`, pageCount: 2 })) };
export const chapterDetail = { ...chapterList, chapter: chapterList.chapters[0], pages: [{ index: 1, width: 800, height: 1200 }, { index: 2, width: 800, height: 1200 }], previous: null, next: '2' };
test('reader uses separate real API contract, cache policy and abort signal', async () => {
  const fetch = vi.fn(async () => Response.json(chapterList)), signal = new AbortController().signal;
  const api = createReaderApi(fetch);
  expect(await api.list('archivo-aurora', { signal })).toEqual(chapterList);
  expect(fetch).toHaveBeenCalledWith('/api/works/archivo-aurora/chapters', { cache: 'no-store', signal });
  expect(chapterHref('archivo-aurora', '2', '?q=Aurora&format=manga')).toBe('/obras/archivo-aurora/capitulos/2?q=Aurora&format=manga');
  expect(api.pageUrl('archivo-aurora', '2', 1)).toBe('/api/works/archivo-aurora/chapters/2/pages/1');
});
test('reader validates chapter detail and exact neighbouring chapters', async () => {
  expect(await createReaderApi(async () => Response.json(chapterDetail)).detail('archivo-aurora', '1')).toEqual(chapterDetail);
});
test.each([
  { ...chapterList, source: { kind: 'synthetic', persisted: false } },
  { ...chapterList, chapters: [...chapterList.chapters].reverse() },
  { ...chapterList, chapters: [chapterList.chapters[0], chapterList.chapters[0]] },
  { ...chapterList, work: { id: 'another-work', title: 'Wrong' } },
  { ...chapterList, chapters: [{ number: '../1', title: 'Invalid', pageCount: 2 }] },
])('rejects malformed, duplicate, unordered or wrong-work lists', async payload => {
  await expect(createReaderApi(async () => Response.json(payload)).list('archivo-aurora')).rejects.toMatchObject({ code: 'invalid_response' });
});
test.each([
  { ...chapterDetail, next: '10' }, { ...chapterDetail, previous: '0' },
  { ...chapterDetail, pages: [{ index: 1, width: 0, height: 100 }] },
  { ...chapterDetail, chapter: { ...chapterDetail.chapter, number: '2' } },
])('rejects invalid chapter detail instead of inventing navigation', async payload => {
  await expect(createReaderApi(async () => Response.json(payload)).detail('archivo-aurora', '1')).rejects.toMatchObject({ code: 'invalid_response' });
});
test('reader preserves unavailable/not-found states and rejects arbitrary URL inputs', async () => {
  await expect(createReaderApi(async () => new Response('', { status: 404 })).detail('archivo-aurora', '3')).rejects.toMatchObject({ code: 'not_found' });
  await expect(createReaderApi(async () => new Response('', { status: 503 })).list('archivo-aurora')).rejects.toMatchObject({ code: 'unavailable' });
  const fetch = vi.fn(); const api = createReaderApi(fetch);
  await expect(api.list('https://example.invalid')).rejects.toMatchObject({ code: 'not_found' });
  expect(() => api.pageUrl('archivo-aurora', '../1', 1)).toThrow(); expect(fetch).not.toHaveBeenCalled();
});
