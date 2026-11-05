import { useEffect, useState } from 'react';
import { getHealth } from './health-client.js';
import './App.css';

export default function App({ loadHealth = getHealth }) {
  const [attempt, setAttempt] = useState(0);
  const [phase, setPhase] = useState('loading');
  useEffect(() => {
    const controller = new AbortController();
    let current = true;
    setPhase('loading');
    const timer = setTimeout(() => {
      current = false;
      controller.abort();
      setPhase('error');
    }, 4000);
    const run = async () => {
      try {
        await loadHealth({ signal: controller.signal });
        if (current) setPhase('healthy');
      } catch {
        if (current) setPhase('error');
      } finally {
        clearTimeout(timer);
      }
    };
    void run();
    return () => {
      current = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [attempt, loadHealth]);
  return <main>
    <p className="eyebrow">YitVerse · Servicios Cloud</p>
    <h1>Estado de la conexión</h1>
    <p>Comprobación técnica de la API y PostgreSQL.</p>
    <section className={`state ${phase}`} aria-label="Resultado de la comprobación">
      {phase === 'error'
        ? <p role="alert">No se pudo comprobar la conexión</p>
        : <p role="status">{phase === 'loading' ? 'Comprobando conexión…' : 'Backend y PostgreSQL disponibles'}</p>}
    </section>
    <button disabled={phase === 'loading'} onClick={() => setAttempt(value => value + 1)}>Reintentar</button>
    <p className="note">El resultado corresponde a la última comprobación. Reintenta para actualizarlo.</p>
  </main>;
}
