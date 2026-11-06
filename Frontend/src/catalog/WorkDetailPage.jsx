import { useCallback } from 'react';
import { exploreHref } from './catalog-navigation.js';
import { useResource } from './use-resource.js';
import { WorkCover, LoadingState, ErrorState, NotFound, formatLabel } from './components.jsx';

export default function WorkDetailPage({ api, id, search }) {
  const load = useCallback(signal => api.detail(id, { signal }), [api, id]);
  const resource = useResource(load);
  const params = new URLSearchParams(search);
  const back = exploreHref({ query: params.get('q') ?? '', format: params.get('format') ?? '' });
  if (resource.error?.code === 'not_found') return <NotFound work back={back} />;
  const work = resource.data?.item;
  return <main id="contenido" tabIndex={-1} className="catalog-main detail-main">
    <a className="back-link" href={back}><svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20 12H4m7-7-7 7 7 7" /></svg>Volver al catálogo</a>
    {resource.status === 'loading' && <LoadingState detail />}
    {resource.status === 'error' && <ErrorState detail retry={resource.retry} />}
    {resource.status === 'ready' && <article className="work-detail">
      <div className="detail-art"><WorkCover work={work} large /><p>Composición gráfica de demostración.</p></div>
      <div className="detail-copy"><p className="section-kicker">Una historia de nuestro universo de muestra</p><div className="detail-badges"><span>{formatLabel(work.format)}</span><span>Obra ficticia</span></div><h1>{work.title}</h1><div className="genre-tags">{work.genres.map(genre => <span key={genre}>{genre}</span>)}</div><section className="synopsis"><h2>Sinopsis</h2><p>{work.synopsis}</p></section><aside className="demo-detail-note"><h2>Acerca de este ejemplo</h2><p>Esta obra y su sinopsis son ficticias. La ficha permite explorar el prototipo; no incluye capítulos ni opciones de compra.</p></aside></div>
    </article>}
  </main>;
}
