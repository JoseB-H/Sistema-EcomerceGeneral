import { catalogQuery } from './catalog-client.js';

export function isCatalogLocation(pathname, search) {
  const params = new URLSearchParams(search);
  return pathname === '/explorar' || (pathname === '/' && (params.has('q') || params.has('format')));
}

export function exploreHref({ query = '', format = '' } = {}) {
  return `/explorar${catalogQuery(query, format)}`;
}

export function workHref({ id, query = '', format = '' }) {
  return `/obras/${encodeURIComponent(id)}${catalogQuery(query, format)}`;
}
