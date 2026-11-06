import { useCallback, useState } from 'react';
import { useResource } from './use-resource.js';
import { deriveHomeSections } from './home-sections.js';
import { exploreHref } from './catalog-navigation.js';
import { WorkCard, SearchForm, LoadingState, ErrorState, ArrowIcon } from './components.jsx';
import Hero from './Hero.jsx';

const navigateTo = href => window.location.assign(href);

function EditorialSection({ id, title, description, works }) {
  if (!works.length) return null;
  return <section className="home-section" aria-labelledby={id}>
    <div className="home-section-heading"><div><p className="section-kicker">Elige otro universo</p><h2 id={id}>{title}</h2><p>{description}</p></div><a className="text-link" href={exploreHref()}>Ver catálogo completo <ArrowIcon /></a></div>
    <div className="works-grid home-works-grid">{works.map(work => <WorkCard key={work.id} work={work} headingLevel={3} />)}</div>
  </section>;
}

export default function HomePage({ api, navigate = navigateTo }) {
  const load = useCallback(signal => api.list({ signal }), [api]);
  const resource = useResource(load);
  const [draft, setDraft] = useState({ query: '', format: '' });
  const sections = deriveHomeSections(resource.data?.items ?? []);
  return <main id="contenido" tabIndex={-1} className="catalog-main home-page">
    <Hero work={resource.status === 'ready' ? sections.featured : null} />
    <SearchForm {...draft} onChange={setDraft} onSearch={(query, format) => navigate(exploreHref({ query, format }))} />
    {resource.status === 'loading' && <LoadingState />}
    {resource.status === 'error' && <ErrorState retry={resource.retry} />}
    {resource.status === 'ready' && (sections.featured ? <>
      <EditorialSection id="continue-heading" title="Continuar explorando" description="Más caminos de la colección de muestra, sin historial personal ni recomendaciones personalizadas." works={sections.discovery} />
      <EditorialSection id="selection-heading" title="Selección de demostración" description="Otras historias ficticias disponibles en el catálogo. Explora sus universos y sinopsis." works={sections.selection} />
      {sections.categories.length > 0 && <section className="home-section genre-discovery" aria-labelledby="genres-heading"><p className="section-kicker">Encuentra tu atmósfera</p><h2 id="genres-heading">Descubre por género</h2><p>Elige un género presente en la colección y explóralo en el catálogo.</p><div className="genre-links">{sections.categories.map(genre => <a className="genre-link" href={exploreHref({ query: genre })} key={genre}>{genre}<ArrowIcon /></a>)}</div></section>}
    </> : <section className="catalog-feedback"><h2>Todavía no hay obras para explorar</h2><p>El catálogo respondió sin títulos. Vuelve a consultar cuando haya obras de demostración disponibles.</p><button className="button-primary" onClick={resource.retry}>Reintentar</button></section>)}
  </main>;
}
