import { useCallback } from 'react';
import { useResource } from '../catalog/use-resource.js';
import { chapterHref } from './reader-client.js';

export default function ChapterList({ api, id, search = '' }) {
  const load = useCallback(signal => api.list(id, { signal }), [api, id]);
  const resource = useResource(load), chapters = resource.data?.chapters ?? [];
  return <section className="chapter-section" aria-labelledby="chapters-heading">
    <div className="chapter-section-heading"><div><p className="section-kicker">Lectura local</p><h2 id="chapters-heading">Capítulos disponibles</h2></div><span className="chapter-badge">Material propio o autorizado</span></div>
    {resource.status === 'loading' && <p role="status">Cargando capítulos…</p>}
    {resource.status === 'error' && <div className="reader-feedback"><p role="alert">No se pudieron cargar los capítulos.</p><p>La ficha sigue disponible. Comprueba el servidor local e inténtalo otra vez.</p><button className="button-primary" onClick={resource.retry}>Reintentar capítulos</button></div>}
    {resource.status === 'ready' && (chapters.length ? <>
      <p className="chapter-explanation">De principio a fin, en orden numérico. La lectura no guarda progreso personal.</p>
      <a className="button-primary chapter-start" href={chapterHref(id, chapters[0].number, search)}>Leer desde el primer capítulo</a>
      <ol className="chapter-list">{chapters.map(chapter => <li key={chapter.number}><a href={chapterHref(id, chapter.number, search)}><strong>Capítulo {chapter.number}</strong><span>{chapter.title}</span></a></li>)}</ol>
    </> : <div className="chapter-empty"><p>Todavía no hay capítulos disponibles para esta obra.</p><p>Solo aparecerá material importado por la administración local, con declaración de derechos y comprobante.</p></div>)}
  </section>;
}
