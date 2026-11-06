import { useCallback, useState } from 'react';
import { exploreHref } from './catalog-navigation.js';
import { useResource } from './use-resource.js';
import { WorkCard, SearchForm, LoadingState, ErrorState, SearchIcon } from './components.jsx';

export default function CatalogPage({ api, search }) {
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(search);
    return { query: params.get('q') ?? '', format: params.get('format') ?? '' };
  });
  const [draft, setDraft] = useState(filters);
  const load = useCallback(signal => api.list({ ...filters, signal }), [api, filters]);
  const resource = useResource(load);
  const changeSearch = (query, format) => {
    window.history.replaceState({}, '', exploreHref({ query, format }));
    setDraft({ query, format });
    setFilters({ query, format });
  };
  return <main id="contenido" tabIndex={-1} className="catalog-main">
    <div className="explore-intro"><p className="section-kicker">Un universo de posibilidades</p><h1>Explorar el catálogo</h1><p>Busca por título o género y encuentra tu próxima historia entre las obras ficticias de demostración.</p></div>
    <SearchForm {...draft} onChange={setDraft} onSearch={changeSearch} />
    <section aria-labelledby="catalog-heading" className="catalog-results">
      <div className="results-heading"><div><p className="section-kicker">Encuentra otro mundo</p><h2 id="catalog-heading">Obras de demostración<span aria-hidden="true">.</span></h2></div>{resource.status === 'ready' && <p aria-live="polite">{resource.data.items.length} {resource.data.items.length === 1 ? 'obra de demostración' : 'obras de demostración'}</p>}</div>
      {resource.status === 'loading' && <LoadingState />}
      {resource.status === 'error' && <ErrorState retry={resource.retry} />}
      {resource.status === 'ready' && (resource.data.items.length
        ? <div className="works-grid">{resource.data.items.map(work => <WorkCard key={work.id} work={work} {...filters} />)}</div>
        : <section className="catalog-feedback"><span className="feedback-symbol" aria-hidden="true"><SearchIcon /></span><span className="section-kicker">Un camino por descubrir</span><h3>No encontramos obras con esa búsqueda</h3><p>Prueba otro título o explora todos los formatos de demostración.</p><button className="button-primary" onClick={() => changeSearch('', '')}>Limpiar búsqueda</button></section>)}
    </section>
  </main>;
}
