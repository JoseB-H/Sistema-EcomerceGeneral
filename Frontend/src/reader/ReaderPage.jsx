import { useCallback, useState } from 'react';
import { useResource } from '../catalog/use-resource.js';
import { workHref } from '../catalog/catalog-navigation.js';
import { chapterHref } from './reader-client.js';

function ChapterNavigation({ id, data, search, bottom = false }) {
  return <nav className="reader-navigation" aria-label={`Capítulos, ${bottom ? 'final' : 'inicio'} del lector`}>
    {data.previous ? <a className="reader-nav-link" rel="prev" href={chapterHref(id, data.previous, search)}>← Capítulo anterior <span>{data.previous}</span></a> : <span className="reader-boundary">Primer capítulo disponible</span>}
    {data.next ? <a className="reader-nav-link" rel="next" href={chapterHref(id, data.next, search)}>Capítulo siguiente <span>{data.next} →</span></a> : <span className="reader-boundary">Último capítulo disponible</span>}
  </nav>;
}
function ReaderImage({ api, id, number, page, count, title }) {
  const [failed, setFailed] = useState(false), [attempt, setAttempt] = useState(0);
  return <figure className="reader-page" aria-label={`Página ${page.index}`}>
    {failed ? <div className="reader-image-error"><p role="alert">No se pudo cargar la página {page.index}.</p><p>Puedes volver a solicitar esta página sin salir del capítulo.</p><button className="button-primary" onClick={() => { setFailed(false); setAttempt(n => n + 1); }}>Reintentar página {page.index}</button></div>
      : <img key={attempt} src={api.pageUrl(id, number, page.index)} width={page.width} height={page.height} loading={page.index === 1 ? 'eager' : 'lazy'} decoding="async" alt={`Página ${page.index} de ${count} · ${title} · Capítulo ${number}`} onError={() => setFailed(true)} />}
    <figcaption>Página {page.index} de {count}</figcaption>
  </figure>;
}
export default function ReaderPage({ api, id, number, search = '' }) {
  const load = useCallback(signal => api.detail(id, number, { signal }), [api, id, number]);
  const resource = useResource(load), data = resource.data;
  const params = new URLSearchParams(search), back = workHref({ id, query: params.get('q') ?? '', format: params.get('format') ?? '' });
  return <main id="contenido" tabIndex={-1} className="catalog-main reader-main">
    <a className="back-link" href={back}><span aria-hidden="true">← </span>Volver a la ficha</a>
    {resource.status === 'loading' && <section className="reader-feedback"><h1>Lector vertical</h1><p role="status">Cargando capítulo…</p></section>}
    {resource.status === 'error' && <section className="reader-feedback"><h1>{resource.error?.code === 'not_found' ? 'Capítulo no disponible' : 'Lector vertical'}</h1>{resource.error?.code === 'not_found' ? <p>No encontramos este capítulo entre los disponibles. Vuelve a la ficha para consultar la lista.</p> : <><p role="alert">No se pudo cargar el capítulo.</p><p>Comprueba el servidor y la disponibilidad del almacén local.</p><button className="button-primary" onClick={resource.retry}>Reintentar lector</button></>}</section>}
    {resource.status === 'ready' && <>
      <header className="reader-heading"><p className="section-kicker">YitVerse · Lectura vertical</p><h1>{data.work.title} · Capítulo {data.chapter.number}</h1><p className="reader-subtitle">{data.chapter.title}</p><p className="reader-disclaimer">Obra ficticia de demostración · Sin progreso personal guardado.</p></header>
      <div className="reader-controls"><label htmlFor="reader-chapter">Ir al capítulo</label><select id="reader-chapter" value={number} onChange={event => window.location.assign(chapterHref(id, event.target.value, search))}>{data.chapters.map(c => <option key={c.number} value={c.number}>Capítulo {c.number} · {c.title}</option>)}</select></div>
      <ChapterNavigation id={id} data={data} search={search} />
      <section className="reader-pages" aria-label="Páginas del capítulo">{data.pages.map(page => <ReaderImage key={`${number}-${page.index}`} api={api} id={id} number={number} page={page} count={data.pages.length} title={data.work.title} />)}</section>
      <p className="reader-end">Fin del capítulo {data.chapter.number}</p>
      <ChapterNavigation id={id} data={data} search={search} bottom />
      <a className="reader-all-link" href={`${back}#chapters-heading`}>Ver todos los capítulos</a>
    </>}
  </main>;
}
