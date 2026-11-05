import { useCallback, useEffect, useState } from 'react';
import { catalogQuery } from './catalog-client.js';
import { useResource } from './use-resource.js';
import { WorkCard, SearchForm, LoadingState, ErrorState, ArrowIcon, SearchIcon } from './components.jsx';
import { NightArtwork } from './artwork.jsx';

export default function CatalogPage({ api, search }) {
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(search);
    return { query: params.get('q') ?? '', format: params.get('format') ?? '' };
  });
  const [draft, setDraft] = useState(filters);
  useEffect(() => {
    if (window.location.hash === '#catalog-query') document.getElementById('catalog-query')?.focus();
  }, []);
  const load = useCallback(signal => api.list({ ...filters, signal }), [api, filters]);
  const resource = useResource(load);
  const changeSearch = (query, format) => {
    window.history.replaceState({}, '', `/${catalogQuery(query, format)}`);
    setDraft({ query, format });
    setFilters({ query, format });
  };
  return <main id="contenido" tabIndex={-1} className="catalog-main">
    <section className="catalog-intro" aria-labelledby="discovery-title">
      <div className="hero-copy"><p className="section-kicker"><span aria-hidden="true" />Más allá de lo cotidiano</p><h1 id="discovery-title">Tu próxima historia<br /><span>empieza aquí.</span></h1><p className="intro-copy">Mundos por descubrir. Historias para perderse.<br className="desktop-break" /> Encuentra tu siguiente universo entre mangas y manhwas.</p><a className="button-primary hero-action" href="#catalog-query">Explorar catálogo <ArrowIcon /></a><p className="hero-note">Una colección ficticia. Posibilidades para imaginar.</p></div>
      <div className="hero-art"><NightArtwork /><span className="hero-art-label">ARTE ORIGINAL / UNIVERSO YITVERSE</span></div>
    </section>
    <SearchForm {...draft} onChange={setDraft} onSearch={changeSearch} />
    <section aria-labelledby="catalog-heading" className="catalog-results">
      <div className="results-heading"><div><p className="section-kicker">Encuentra otro mundo</p><h2 id="catalog-heading">Explorar el catálogo<span aria-hidden="true">.</span></h2></div>{resource.status === 'ready' && <p aria-live="polite">{resource.data.items.length} {resource.data.items.length === 1 ? 'obra de demostración' : 'obras de demostración'}</p>}</div>
      {resource.status === 'loading' && <LoadingState />}
      {resource.status === 'error' && <ErrorState retry={resource.retry} />}
      {resource.status === 'ready' && (resource.data.items.length
        ? <div className="works-grid">{resource.data.items.map(work => <WorkCard key={work.id} work={work} {...filters} />)}</div>
        : <section className="catalog-feedback"><span className="feedback-symbol" aria-hidden="true"><SearchIcon /></span><span className="section-kicker">Un camino por descubrir</span><h3>No encontramos obras con esa búsqueda</h3><p>Prueba otro título o explora todos los formatos de demostración.</p><button className="button-primary" onClick={() => changeSearch('', '')}>Limpiar búsqueda</button></section>)}
    </section>
  </main>;
}
