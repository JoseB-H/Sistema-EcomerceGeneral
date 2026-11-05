export class CatalogError extends Error {
  constructor(code) { super('Catalog request failed'); this.code = code; }
}
export function catalogQuery(query = '', format = '') {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (format) params.set('format', format);
  return params.size ? `?${params}` : '';
}
const validId = id => typeof id === 'string' && id.length <= 80 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);
const validWork = work => work && validId(work.id) && typeof work.title === 'string' && work.title.length > 0
  && ['manga', 'manhwa'].includes(work.format) && typeof work.synopsis === 'string'
  && Array.isArray(work.genres) && work.genres.every(genre => typeof genre === 'string');

export function createCatalogApi(fetchImpl = globalThis.fetch) {
  async function request(path, signal) {
    let response;
    try { response = await fetchImpl(path, { cache: 'no-store', signal }); }
    catch { throw new CatalogError('unavailable'); }
    if (response.status === 404) throw new CatalogError('not_found');
    if (response.status !== 200) throw new CatalogError('unavailable');
    let data;
    try { data = await response.json(); } catch { throw new CatalogError('invalid_response'); }
    if (data?.source?.kind !== 'synthetic' || data.source.persisted !== false) throw new CatalogError('invalid_response');
    return data;
  }
  return {
    async list({ query = '', format = '', signal } = {}) {
      const data = await request(`/api/works${catalogQuery(query, format)}`, signal);
      if (!Array.isArray(data.items) || !data.items.every(validWork)
        || new Set(data.items.map(item => item.id)).size !== data.items.length) throw new CatalogError('invalid_response');
      return data;
    },
    async detail(id, { signal } = {}) {
      if (!validId(id)) throw new CatalogError('not_found');
      const data = await request(`/api/works/${encodeURIComponent(id)}`, signal);
      if (!validWork(data.item) || data.item.id !== id) throw new CatalogError('invalid_response');
      return data;
    },
  };
}
export const catalogApi = createCatalogApi();
