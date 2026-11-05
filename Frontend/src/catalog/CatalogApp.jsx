import { useEffect } from 'react';
import HealthPage from '../App.jsx';
import { catalogApi } from './catalog-client.js';
import CatalogPage from './CatalogPage.jsx';
import WorkDetailPage from './WorkDetailPage.jsx';
import { NotFound, ArrowIcon } from './components.jsx';
import './catalog.css';

export default function CatalogApp({ api = catalogApi }) {
  const { pathname, search } = window.location;
  useEffect(() => {
    document.body.classList.add('catalog-mode');
    return () => document.body.classList.remove('catalog-mode');
  }, []);
  let page;
  const match = pathname.match(/^\/obras\/([^/]+)\/?$/);
  if (pathname === '/') page = <CatalogPage api={api} search={search} />;
  else if (pathname === '/estado') page = <div id="contenido" tabIndex={-1}><HealthPage /></div>;
  else if (match) {
    let id;
    try { id = decodeURIComponent(match[1]); } catch { /* malformed URL becomes a not-found page */ }
    page = id ? <WorkDetailPage api={api} id={id} search={search} /> : <NotFound work />;
  } else page = <NotFound />;
  return <div className="catalog-shell">
    <a href="#contenido" className="skip-link">Saltar al contenido</a>
    <header className="catalog-header"><div className="header-inner"><a className="brand" href="/" aria-label="YitVerse, catálogo"><span className="brand-symbol" aria-hidden="true">Y<span><ArrowIcon /></span></span><span>Yit<span className="brand-light">Verse</span><small>UN UNIVERSO POR DESCUBRIR</small></span></a><nav aria-label="Principal"><a href="/" aria-current={pathname !== '/estado' ? 'page' : undefined}>Explorar</a><a href="/estado" aria-current={pathname === '/estado' ? 'page' : undefined}>Estado de conexión</a></nav><span className="local-pill"><i aria-hidden="true" /> Prototipo local</span></div></header>
    <div className="demo-banner"><strong>Datos de demostración</strong><span>Todas las obras son ficticias. No se guardan cambios.</span></div>
    {page}
    <footer className="catalog-footer"><span className="footer-brand">YitVerse<span> / </span>Explora a tu ritmo.</span><span>Catálogo sintético · Prototipo local</span></footer>
  </div>;
}
