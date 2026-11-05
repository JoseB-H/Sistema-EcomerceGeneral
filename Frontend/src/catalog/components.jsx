import { useState } from 'react';
import { catalogQuery } from './catalog-client.js';

export const formatLabel = value => value === 'manga' ? 'Manga' : 'Manhwa';
export function ArrowIcon() {
  return <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 19 19 5M5 5h14v14" /></svg>;
}
export function WorkCover({ work, large = false }) {
  const tone = [...work.id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 6;
  return <div className={`work-cover ${large ? 'cover-large' : ''}`} data-tone={tone} aria-hidden="true">
    <span className="cover-top">Y / V <span>{formatLabel(work.format)}</span></span>
    <span className="cover-orbit" />
    <span className="cover-title">{work.title}</span>
    <span className="cover-bottom">Arte de demostración <ArrowIcon /></span>
  </div>;
}
export function WorkCard({ work, query, format }) {
  const href = `/obras/${work.id}${catalogQuery(query, format)}`;
  return <article className="work-card">
    <a href={href} aria-label={`Ver ficha de ${work.title}`} className="work-card-link">
      <WorkCover work={work} />
      <div className="card-meta"><span>{formatLabel(work.format)}</span><span>Obra ficticia</span></div>
      <h2>{work.title}</h2>
      <p className="card-genre">{work.genres.join(' · ')}</p>
      <span className="card-action">Ver ficha <ArrowIcon /></span>
    </a>
  </article>;
}
export function SearchForm({ query, format, onSearch }) {
  const [draft, setDraft] = useState(query);
  const [selected, setSelected] = useState(format);
  return <form className="catalog-search" role="search" onSubmit={event => { event.preventDefault(); onSearch(draft.trim(), selected); }}>
    <div className="search-field"><label htmlFor="catalog-query">Buscar obras</label><input id="catalog-query" type="search" maxLength={100} value={draft} onChange={event => setDraft(event.target.value)} placeholder="Título, género o una nueva historia…" /></div>
    <div className="format-field"><label htmlFor="catalog-format">Formato</label><select id="catalog-format" value={selected} onChange={event => setSelected(event.target.value)}><option value="">Todos los formatos</option><option value="manga">Manga</option><option value="manhwa">Manhwa</option></select></div>
    <button className="button-primary" type="submit">Buscar <ArrowIcon /></button>
  </form>;
}
export function LoadingState({ detail = false }) {
  return <div className="catalog-feedback"><span className="loading-dot" aria-hidden="true" /><p role="status">{detail ? 'Cargando ficha…' : 'Cargando catálogo…'}</p></div>;
}
export function ErrorState({ detail = false, retry }) {
  return <section className="catalog-feedback error-feedback"><p role="alert">{detail ? 'No se pudo cargar la ficha' : 'No se pudo cargar el catálogo'}</p><p>Comprueba que el servidor local está disponible y vuelve a intentarlo.</p><button className="button-primary" onClick={retry}>Reintentar</button></section>;
}
export function NotFound({ work = false, back = '/' }) {
  return <main id="contenido" tabIndex={-1} className="catalog-main"><section className="catalog-feedback"><span className="section-kicker">No encontrado</span><h1>{work ? 'No encontramos esta obra' : 'Esta página no existe'}</h1><p>Explora las obras de demostración disponibles en el catálogo.</p><a className="text-link" href={back}>Volver al catálogo <ArrowIcon /></a></section></main>;
}
