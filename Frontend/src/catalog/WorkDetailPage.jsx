import { useCallback } from 'react';
import { exploreHref } from './catalog-navigation.js';
import { useResource } from './use-resource.js';
import { WorkCover, LoadingState, ErrorState, NotFound, formatLabel, titleLabel } from './components.jsx';
import ChapterList from '../reader/ChapterList.jsx';

export default function WorkDetailPage({ api, readingApi, id, search }) {
  const load = useCallback(signal => api.detail(id, { signal }), [api, id]);
  const resource = useResource(load);
  const params = new URLSearchParams(search);
  const back = exploreHref({ query: params.get('q') ?? '', format: params.get('format') ?? '' });
  if (resource.error?.code === 'not_found') return <NotFound work back={back} />;
  const work = resource.data?.item;
  const genres = [...new Set(work?.genres.map(genre => genre.trim()).filter(Boolean) ?? [])];
  return <main id="contenido" tabIndex={-1} className="catalog-main detail-main">
    <a className="back-link" href={back}><svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20 12H4m7-7-7 7 7 7" /></svg>Volver al catálogo</a>
    {resource.status !== 'ready' && <h1 className="detail-state-title">Ficha de obra</h1>}
    {resource.status === 'loading' && <LoadingState detail />}
    {resource.status === 'error' && <ErrorState detail retry={resource.retry} />}
    {resource.status === 'ready' && <article className="work-detail">
      <div className="detail-heading"><p className="section-kicker">YitVerse · Obra ficticia</p><h1>{titleLabel(work.title)}</h1><dl className="work-facts"><div><dt id="work-format-label">Formato</dt><dd aria-labelledby="work-format-label">{formatLabel(work.format)}</dd></div></dl></div>
      <figure className="detail-art"><WorkCover work={work} large /><figcaption>Ilustración original de demostración.</figcaption></figure>
      <div className="detail-copy">
        <section className="detail-genres" aria-labelledby="work-genres-heading"><h2 id="work-genres-heading">Géneros</h2>{genres.length ? <ul className="genre-tags">{genres.map(genre => <li key={genre}>{genre}</li>)}</ul> : <p className="missing-metadata">Géneros no especificados.</p>}</section>
        <section className="synopsis" aria-labelledby="synopsis-heading"><h2 id="synopsis-heading">Sinopsis</h2><p>{work.synopsis.trim() ? work.synopsis : 'Sinopsis no disponible en esta demostración.'}</p></section>
        <aside className="demo-detail-note"><h2>Acerca de este ejemplo</h2><p>Esta obra y su sinopsis son ficticias. Los capítulos aparecen únicamente si se ha importado material propio o autorizado en el entorno local. No hay opciones de compra.</p></aside>
      </div>
    </article>}
    {resource.status === 'ready' && readingApi && <ChapterList api={readingApi} id={id} search={search} />}
  </main>;
}
