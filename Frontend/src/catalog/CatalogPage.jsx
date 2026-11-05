import { useCallback, useState } from 'react';
import { catalogQuery } from './catalog-client.js';
import { useResource } from './use-resource.js';
import { WorkCard, SearchForm, LoadingState, ErrorState } from './components.jsx';

export default function CatalogPage({ api, search }) {
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(search);
    return { query: params.get('q') ?? '', format: params.get('format') ?? '' };
  });
  const load = useCallback(signal => api.list({ ...filters, signal }), [api, filters]);
  const resource = useResource(load);
  const changeSearch = (query, format) => {
    window.history.replaceState({}, '', `/${catalogQuery(query, format)}`);
    setFilters({ query, format });
  };
  return <main id="contenido" tabIndex={-1} className="catalog-main">
    <section className="catalog-intro">
      <div><p className="section-kicker">Tu siguiente descubrimiento</p><h1>Historias para<br /><em>dejarte llevar.</em></h1><p className="intro-copy">Explora nuevas ideas entre mangas y manhwas.<br className="desktop-break" /> Un pequeño universo de historias por descubrir.</p></div>
      <div className="intro-emblem" aria-hidden="true"><span className="emblem-orbit" /><span className="emblem-star">✳</span><span className="emblem-caption">YITVERSE<br />EXPLORA / DESCUBRE</span></div>
    </section>
    <SearchForm key={`${filters.query}:${filters.format}`} {...filters} onSearch={changeSearch} />
    <section aria-labelledby="catalog-heading" className="catalog-results">
      <div className="results-heading"><h2 id="catalog-heading">Explorar el catálogo</h2>{resource.status === 'ready' && <p aria-live="polite">{resource.data.items.length} {resource.data.items.length === 1 ? 'obra de demostración' : 'obras de demostración'}</p>}</div>
      {resource.status === 'loading' && <LoadingState />}
      {resource.status === 'error' && <ErrorState retry={resource.retry} />}
      {resource.status === 'ready' && (resource.data.items.length
        ? <div className="works-grid">{resource.data.items.map(work => <WorkCard key={work.id} work={work} {...filters} />)}</div>
        : <section className="catalog-feedback"><span className="section-kicker">Un camino por descubrir</span><h3>No encontramos obras con esa búsqueda</h3><p>Prueba otro título o explora todos los formatos de demostración.</p><button className="button-primary" onClick={() => changeSearch('', '')}>Limpiar búsqueda</button></section>)}
    </section>
  </main>;
}
