import React from 'react';
import { test, expect, vi } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import WorkDetailPage from '../src/catalog/WorkDetailPage.jsx';
import { WorkCover } from '../src/catalog/components.jsx';
import { createCatalogApi } from '../src/catalog/catalog-client.js';
import { work, source } from './catalog-fixtures.js';

function show(payload, search = '?q=Aurora&format=manga') {
  const api = createCatalogApi(async () => Response.json(payload));
  return render(<WorkDetailPage api={api} id={work.id} search={search} />);
}

test('detail groups genuine format and genres, with only implemented navigation', async () => {
  show({ source, item: work });
  await screen.findByRole('heading', { level: 1, name: work.title });
  const facts = screen.getByRole('definition', { name: 'Formato' });
  expect(facts).toHaveTextContent('Manga');
  expect(within(screen.getByRole('region', { name: 'Géneros' })).getByText('Ciencia ficción')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Volver al catálogo/ })).toHaveAttribute('href', '/explorar?q=Aurora&format=manga');
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Leer|Seguir|Comprar/ })).not.toBeInTheDocument();
});

test('valid empty synopsis and genres have honest visible explanations', async () => {
  show({ source, item: { ...work, synopsis: '  ', genres: [] } });
  await screen.findByRole('heading', { level: 1, name: work.title });
  expect(screen.getByText('Sinopsis no disponible en esta demostración.')).toBeInTheDocument();
  expect(screen.getByText('Géneros no especificados.')).toBeInTheDocument();
});

test('empty and repeated genre labels do not create duplicate tags or React warnings', async () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    show({ source, item: { ...work, genres: ['', '  ', 'Drama', 'Drama'] } });
    await screen.findByRole('heading', { level: 1, name: work.title });
    const genres = within(screen.getByRole('region', { name: 'Géneros' }));
    expect(genres.getAllByRole('listitem')).toHaveLength(1);
    expect(genres.getByText('Drama')).toBeInTheDocument();
    expect(log).not.toHaveBeenCalled();
  } finally { log.mockRestore(); }
});

test('extensive metadata stays complete and markup-like synopsis is plain text', async () => {
  const title = 'Un relato ficticio de prueba '.repeat(10);
  const synopsis = '<script>Texto ficticio</script> & <b>sin HTML</b>\n\n' + 'Palabra'.repeat(60);
  show({ source, item: { ...work, title, synopsis } });
  expect(await screen.findByRole('heading', { level: 1, name: title.trim() })).toBeInTheDocument();
  expect(screen.getByText(synopsis, { collapseWhitespace: false })).toBeInTheDocument();
  expect(document.querySelector('.synopsis script, .synopsis b')).toBeNull();
});

test('loading and errors preserve route identity, retry and filtered return', async () => {
  const api = { detail: () => new Promise(() => {}) };
  const pending = render(<WorkDetailPage api={api} id={work.id} search="?q=Aurora" />);
  expect(screen.getByRole('heading', { level: 1, name: 'Ficha de obra' })).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('Cargando ficha');
  pending.unmount();
  let attempts = 0;
  const realApi = createCatalogApi(async () => ++attempts === 1 ? new Response('', { status: 503 }) : Response.json({ source, item: work }));
  render(<WorkDetailPage api={realApi} id={work.id} search="?q=Aurora" />);
  expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo cargar la ficha');
  expect(screen.getByRole('heading', { level: 1, name: 'Ficha de obra' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Volver al catálogo/ })).toHaveAttribute('href', '/explorar?q=Aurora');
  fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
  await screen.findByRole('heading', { level: 1, name: work.title });
});

test.each([null, { ...work, title: '' }, { ...work, format: undefined }, { ...work, synopsis: undefined }, { ...work, genres: null }])('incomplete HTTP response is an error, never a fabricated detail: %j', async item => {
  show({ source, item });
  expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo cargar la ficha');
  expect(screen.queryByRole('heading', { name: work.title })).not.toBeInTheDocument();
});

test('an unknown valid ID named like an inherited property has a safe decorative fallback', () => {
  expect(() => render(<WorkCover work={{ ...work, id: 'constructor' }} />)).not.toThrow();
  expect(document.querySelector('.work-cover')).toHaveAttribute('aria-hidden', 'true');
  expect(document.querySelector('.cover-artwork')).toHaveAttribute('aria-hidden', 'true');
});

test('a whitespace-only title allowed by the current contract is visibly unavailable', async () => {
  show({ source, item: { ...work, title: '   ' } });
  expect(await screen.findByRole('heading', { level: 1, name: 'Título no disponible' })).toBeInTheDocument();
});
