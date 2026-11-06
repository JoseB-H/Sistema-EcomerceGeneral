import { useEffect, useRef } from 'react';
import { workHref } from './catalog-navigation.js';
import { CoverArtwork } from './artwork.jsx';

export const formatLabel = value => value === 'manga' ? 'Manga' : 'Manhwa';
export function ArrowIcon() {
  return <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 19 19 5M5 5h14v14" /></svg>;
}
export function SearchIcon() {
  return <svg aria-hidden="true" focusable="false" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>;
}
export function VerseMark() {
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 40 40" fill="none"><path d="m6 8 14 17L34 8M20 25v10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /><path d="m13 6 7 9 7-9" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" /></svg>;
}
export function WorkCover({ work, large = false }) {
  return <div className={`work-cover ${large ? 'cover-large' : ''}`} aria-hidden="true">
    <CoverArtwork id={work.id} />
    <span className="cover-top">YITVERSE <span>{formatLabel(work.format)}</span></span>
    <span className="cover-title">{work.title}</span>
    <span className="cover-bottom">UNIVERSO FICTICIO <ArrowIcon /></span>
  </div>;
}
export function WorkCard({ work, query, format, headingLevel = 2 }) {
  const Heading = `h${headingLevel}`;
  const href = workHref({ id: work.id, query, format });
  return <article className="work-card">
    <a href={href} aria-label={`Ver ficha de ${work.title}`} className="work-card-link">
      <WorkCover work={work} />
      <div className="card-meta"><span>{formatLabel(work.format)}</span><span>Obra ficticia</span></div>
      <Heading>{work.title}</Heading>
      <p className="card-genre">{work.genres.join(' · ')}</p>
      <span className="card-action">Ver ficha <ArrowIcon /></span>
    </a>
  </article>;
}
export function SearchForm({ query, format, onChange, onSearch }) {
  const input = useRef(null);
  useEffect(() => {
    if (window.location.hash === '#catalog-query') input.current?.focus();
  }, []);
  return <form className="catalog-search" role="search" onSubmit={event => { event.preventDefault(); onSearch(query.trim(), format); }}>
    <div className="search-field"><label htmlFor="catalog-query">Buscar obras</label><div className="search-input"><SearchIcon /><input ref={input} id="catalog-query" type="search" maxLength={100} value={query} onChange={event => onChange({ query: event.target.value, format })} placeholder="Título, género o una nueva historia…" /></div></div>
    <div className="format-field"><label htmlFor="catalog-format">Formato</label><select id="catalog-format" value={format} onChange={event => onChange({ query, format: event.target.value })}><option value="">Todos los formatos</option><option value="manga">Manga</option><option value="manhwa">Manhwa</option></select></div>
    <button className="button-primary" type="submit">Buscar <ArrowIcon /></button>
  </form>;
}
export function LoadingState({ detail = false }) {
  return <div className="catalog-feedback"><span className="feedback-symbol loading-symbol" aria-hidden="true"><VerseMark /></span><p role="status">{detail ? 'Cargando ficha…' : 'Cargando catálogo…'}</p></div>;
}
export function ErrorState({ detail = false, retry }) {
  return <section className="catalog-feedback error-feedback"><span className="feedback-symbol" aria-hidden="true">!</span><p role="alert">{detail ? 'No se pudo cargar la ficha' : 'No se pudo cargar el catálogo'}</p><p>Comprueba que el servidor local está disponible y vuelve a intentarlo.</p><button className="button-primary" onClick={retry}>Reintentar</button></section>;
}
export function NotFound({ work = false, back = '/explorar' }) {
  return <main id="contenido" tabIndex={-1} className="catalog-main"><section className="catalog-feedback not-found"><span className="feedback-symbol" aria-hidden="true"><SearchIcon /></span><span className="section-kicker">No encontrado</span><h1>{work ? 'No encontramos esta obra' : 'Esta página no existe'}</h1><p>Explora las obras de demostración disponibles en el catálogo.</p><a className="text-link" href={back}>Volver al catálogo <ArrowIcon /></a></section></main>;
}
