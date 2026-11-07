import { catalogQuery } from '../catalog/catalog-client.js';

export class ReaderError extends Error { constructor(code) { super('Reader request failed'); this.code = code; } }
const validId = value => typeof value === 'string' && value.length <= 80 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const validNumber = value => typeof value === 'string' && /^(?:0|[1-9]\d{0,5})(?:\.\d{0,2}[1-9])?$/.test(value);
const validText = value => typeof value === 'string' && !!value.trim() && value.length <= 200 && !/[\u0000-\u001f\u007f]/.test(value);
const validChapter = c => c && validNumber(c.number) && validText(c.title) && Number.isInteger(c.pageCount) && c.pageCount > 0 && c.pageCount <= 200;
const requireIdentity = (id, number) => { if (!validId(id) || (number !== undefined && !validNumber(number))) throw new ReaderError('not_found'); };
export function chapterHref(id, number, search = '') {
  requireIdentity(id, number);
  const params = new URLSearchParams(search);
  return `/obras/${encodeURIComponent(id)}/capitulos/${number}${catalogQuery(params.get('q') ?? '', params.get('format') ?? '')}`;
}
export function createReaderApi(fetchImpl = globalThis.fetch) {
  async function request(id, suffix, signal) {
    requireIdentity(id);
    let response, data;
    try { response = await fetchImpl(`/api/works/${id}/chapters${suffix}`, { cache: 'no-store', signal }); }
    catch { throw new ReaderError('unavailable'); }
    if (response.status === 404) throw new ReaderError('not_found');
    if (response.status !== 200) throw new ReaderError('unavailable');
    try { data = await response.json(); } catch { throw new ReaderError('invalid_response'); }
    if (data?.source?.kind !== 'local-manifest' || typeof data.source.configured !== 'boolean' || data.work?.id !== id || !validText(data.work.title) || !Array.isArray(data.chapters) || data.chapters.length > 10000 || !data.chapters.every(validChapter)
      || data.chapters.some((c, i) => i > 0 && Number(c.number) <= Number(data.chapters[i - 1].number)) || (!data.source.configured && data.chapters.length)) throw new ReaderError('invalid_response');
    return data;
  }
  return {
    list(id, { signal } = {}) { return request(id, '', signal); },
    async detail(id, number, { signal } = {}) {
      requireIdentity(id, number);
      const data = await request(id, `/${number}`, signal);
      const i = data.chapters.findIndex(c => c.number === number);
      if (i < 0 || !validChapter(data.chapter) || data.chapter.number !== number || data.chapter.title !== data.chapters[i].title || data.chapter.pageCount !== data.chapters[i].pageCount || data.previous !== (data.chapters[i - 1]?.number ?? null) || data.next !== (data.chapters[i + 1]?.number ?? null) || !Array.isArray(data.pages) || data.pages.length !== data.chapter.pageCount || !data.pages.every((p,i) => p.index === i + 1 && Number.isInteger(p.width) && Number.isInteger(p.height) && p.width > 0 && p.height > 0 && p.width <= 16000 && p.height <= 40000 && p.width * p.height <= 40_000_000)) throw new ReaderError('invalid_response');
      return data;
    },
    pageUrl(id, number, index) {
      requireIdentity(id, number);
      if (!Number.isInteger(index) || index < 1 || index > 200) throw new ReaderError('invalid_response');
      return `/api/works/${id}/chapters/${number}/pages/${index}`;
    },
  };
}
export const readerApi = createReaderApi();
