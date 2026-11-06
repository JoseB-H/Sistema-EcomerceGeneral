import { useEffect } from 'react';
import HealthPage from '../App.jsx';
import { catalogApi } from './catalog-client.js';
import CatalogPage from './CatalogPage.jsx';
import HomePage from './HomePage.jsx';
import { isCatalogLocation } from './catalog-navigation.js';
import WorkDetailPage from './WorkDetailPage.jsx';
import { NotFound, SearchIcon, VerseMark } from './components.jsx';
import './tokens.css';
import './catalog.css';
import './HomePage.css';
import './catalog-responsive.css';

export default function CatalogApp({ api = catalogApi }) {
  const { pathname, search } = window.location;
  useEffect(() => {
    document.body.classList.add('catalog-mode');
    return () => document.body.classList.remove('catalog-mode');
  }, []);
  const isCatalog = isCatalogLocation(pathname, search);
  const isHome = pathname === '/' && !isCatalog;
  let page;
  const match = pathname.match(/^\/obras\/([^/]+)\/?$/);
  if (isCatalog) page = <CatalogPage api={api} search={search} />;
  else if (isHome) page = <HomePage api={api} />;
  else if (pathname === '/estado') page = <div id="contenido" tabIndex={-1} className="health-view"><HealthPage /></div>;
  else if (match) {
    let id;
    try { id = decodeURIComponent(match[1]); } catch { /* malformed URL becomes a not-found page */ }
    page = id ? <WorkDetailPage api={api} id={id} search={search} /> : <NotFound work />;
  } else page = <NotFound />;
  return <div className="catalog-shell">
    <a href="#contenido" className="skip-link">Saltar al contenido</a>
    <header className="catalog-header"><div className="header-inner">
      <a className="brand" href="/" aria-label="YitVerse, inicio"><span className="brand-symbol"><VerseMark /></span><span>Yit<span className="brand-light">Verse</span></span></a>
      <nav aria-label="Principal"><a href="/" aria-current={isHome ? 'page' : undefined}>Inicio</a><a href="/explorar" aria-current={isCatalog ? 'page' : undefined}>Explorar</a><a href="/estado" aria-current={pathname === '/estado' ? 'page' : undefined}>Estado de conexión</a></nav>
      <a className="header-search" href={isHome || isCatalog ? '#catalog-query' : '/explorar#catalog-query'} aria-label="Buscar en el catálogo"><SearchIcon /><span>Buscar obras</span></a>
      <span className="local-pill">Prototipo local</span>
    </div></header>
    <div className="demo-banner"><strong><span aria-hidden="true">✦ </span>Datos de demostración</strong><span>Todas las obras son ficticias. No se guardan cambios.</span></div>
    {page}
    <footer className="catalog-footer"><div className="footer-identity"><a className="brand" href="/" aria-label="YitVerse, inicio"><span className="brand-symbol"><VerseMark /></span><span>Yit<span className="brand-light">Verse</span></span></a><p>Historias que abren otros mundos.</p></div><nav aria-label="Enlaces de YitVerse"><a href="/">Inicio</a><a href="/explorar">Explorar</a><a href="/estado">Estado de conexión</a></nav><p className="footer-note">Catálogo sintético<br />Hecho para imaginar.</p></footer>
  </div>;
}
