import { ArrowIcon, WorkCover, formatLabel, titleLabel } from './components.jsx';
import { NightArtwork } from './artwork.jsx';
import { exploreHref, workHref } from './catalog-navigation.js';

export default function Hero({ work }) {
  const title = work ? titleLabel(work.title) : '';
  return <section className="catalog-intro home-hero" aria-labelledby="discovery-title">
    <div className="hero-copy">
      <p className="section-kicker"><span aria-hidden="true" />{work ? 'Una puerta a otro mundo' : 'Historias por descubrir'}</p>
      {work ? <>
        <div className="hero-work-meta"><span>{formatLabel(work.format)}</span><span>Obra ficticia</span></div>
        <h1 id="discovery-title">{title}</h1>
        <p className="intro-copy">{work.synopsis}</p>
      </> : <><h1 id="discovery-title">Tu próxima historia<br /><span>empieza aquí.</span></h1><p className="intro-copy">Explora otros mundos entre mangas y manhwas de demostración.</p></>}
      <div className="home-hero-actions">
        {work && <a className="button-primary" href={workHref({ id: work.id })} aria-label={`Ver ficha de ${title}`}>Descubrir la obra <ArrowIcon /></a>}
        <a className={work ? 'text-link' : 'button-primary'} href={exploreHref()}>Explorar catálogo <ArrowIcon /></a>
      </div>
      <p className="hero-note">Una colección ficticia. Posibilidades para imaginar.</p>
    </div>
    <div className="hero-art"><NightArtwork /></div>
    {work && <div className="home-feature-cover"><WorkCover work={work} /><span>ILUSTRACIÓN ORIGINAL · DEMOSTRACIÓN</span></div>}
  </section>;
}
