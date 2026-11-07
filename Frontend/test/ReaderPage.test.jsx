import React from 'react';
import { test, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ReaderPage from '../src/reader/ReaderPage.jsx';
import ChapterList from '../src/reader/ChapterList.jsx';
import CatalogApp from '../src/catalog/CatalogApp.jsx';
import { createReaderApi } from '../src/reader/reader-client.js';
import { detail } from './catalog-fixtures.js';

const chapters = ['1', '2', '10'].map(number => ({ number, title: `Relato original ${number}`, pageCount: 2 }));
const list = { work: { id: 'archivo-aurora', title: 'Archivo Aurora' }, source: { kind: 'local-manifest', configured: true }, chapters };
const payload = number => ({ ...list, chapter: chapters.find(c => c.number === number), previous: number === '1' ? null : number === '2' ? '1' : '2', next: number === '10' ? null : number === '1' ? '2' : '10', pages: [{ index: 1, width: 800, height: 1200 }, { index: 2, width: 800, height: 1200 }] });
const readingApi = createReaderApi(async url => Response.json(/\/chapters$/.test(url) ? list : payload(url.split('/').at(-1))));
afterEach(() => window.history.replaceState({}, '', '/'));
test('chapter list shows real numeric order and filtered first-chapter link', async () => {
  render(<ChapterList api={readingApi} id="archivo-aurora" search="?q=Aurora&format=manga" />);
  expect(screen.getByRole('status')).toHaveTextContent('Cargando capítulos');
  expect(await screen.findByRole('link', { name: 'Leer desde el primer capítulo' })).toHaveAttribute('href', '/obras/archivo-aurora/capitulos/1?q=Aurora&format=manga');
  expect(screen.getAllByRole('link', { name: /Capítulo \d/ }).map(a => a.textContent)).toEqual(['Capítulo 1Relato original 1', 'Capítulo 2Relato original 2', 'Capítulo 10Relato original 10']);
});
test('empty list explains availability and offers no simulated read action', async () => {
  render(<ChapterList api={createReaderApi(async () => Response.json({ ...list, source: { ...list.source, configured: false }, chapters: [] }))} id="archivo-aurora" search="" />);
  expect(await screen.findByText(/Todavía no hay capítulos disponibles/)).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Leer/ })).not.toBeInTheDocument();
});
test('chapter list recovers from real request failure', async () => {
  let attempts = 0;
  render(<ChapterList api={createReaderApi(async () => ++attempts === 1 ? new Response('', { status: 503 }) : Response.json(list))} id="archivo-aurora" search="" />);
  expect(await screen.findByRole('alert')).toHaveTextContent('No se pudieron cargar los capítulos');
  fireEvent.click(screen.getByRole('button', { name: 'Reintentar capítulos' }));
  expect(await screen.findByRole('link', { name: 'Leer desde el primer capítulo' })).toBeInTheDocument();
});
test('reader preserves work, chapter, previous/next, intrinsic page size and filtered return', async () => {
  render(<ReaderPage api={readingApi} id="archivo-aurora" number="2" search="?q=Aurora&format=manga" />);
  expect(await screen.findByRole('heading', { level: 1, name: 'Archivo Aurora · Capítulo 2' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Volver a la ficha' })).toHaveAttribute('href', '/obras/archivo-aurora?q=Aurora&format=manga');
  const nav = within(screen.getByRole('navigation', { name: 'Capítulos, inicio del lector' }));
  expect(nav.getByRole('link', { name: /Capítulo anterior/ })).toHaveAttribute('href', '/obras/archivo-aurora/capitulos/1?q=Aurora&format=manga');
  expect(nav.getByRole('link', { name: /Capítulo siguiente/ })).toHaveAttribute('href', '/obras/archivo-aurora/capitulos/10?q=Aurora&format=manga');
  const images = screen.getAllByRole('img'); expect(images).toHaveLength(2);
  expect(images[0]).toHaveAttribute('width', '800'); expect(images[1]).toHaveAttribute('loading', 'lazy');
  expect(images[0]).toHaveAttribute('src', '/api/works/archivo-aurora/chapters/2/pages/1');
  expect(screen.getByRole('combobox', { name: 'Ir al capítulo' })).toHaveValue('2');
});
test('first and latest chapters have honest boundaries instead of dead links', async () => {
  const first = render(<ReaderPage api={readingApi} id="archivo-aurora" number="1" search="" />);
  await screen.findByRole('heading', { name: 'Archivo Aurora · Capítulo 1' });
  expect(screen.queryByRole('link', { name: /Capítulo anterior/ })).not.toBeInTheDocument();
  expect(screen.getAllByText('Primer capítulo disponible')).toHaveLength(2);
  first.unmount();
  render(<ReaderPage api={readingApi} id="archivo-aurora" number="10" search="" />);
  await screen.findByRole('heading', { name: 'Archivo Aurora · Capítulo 10' });
  expect(screen.queryByRole('link', { name: /Capítulo siguiente/ })).not.toBeInTheDocument();
  expect(screen.getAllByText('Último capítulo disponible')).toHaveLength(2);
});
test('failed image has an accessible retry for the same controlled page', async () => {
  render(<ReaderPage api={readingApi} id="archivo-aurora" number="1" search="" />);
  const image = (await screen.findAllByRole('img'))[0]; fireEvent.error(image);
  expect(screen.getByRole('alert')).toHaveTextContent('No se pudo cargar la página 1');
  fireEvent.click(screen.getByRole('button', { name: 'Reintentar página 1' }));
  expect(screen.getByRole('img', { name: /Página 1 de 2/ })).toHaveAttribute('src', '/api/works/archivo-aurora/chapters/1/pages/1');
});
test('unavailable chapter is distinguishable from retryable reader failure', async () => {
  const missing = render(<ReaderPage api={createReaderApi(async () => new Response('', { status: 404 }))} id="archivo-aurora" number="3" search="" />);
  expect(await screen.findByRole('heading', { name: 'Capítulo no disponible' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Reintentar lector' })).not.toBeInTheDocument();
  missing.unmount(); let attempts = 0;
  render(<ReaderPage api={createReaderApi(async () => ++attempts === 1 ? new Response('', { status: 503 }) : Response.json(payload('1')))} id="archivo-aurora" number="1" search="" />);
  expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo cargar el capítulo');
  fireEvent.click(screen.getByRole('button', { name: 'Reintentar lector' }));
  await screen.findByRole('heading', { name: 'Archivo Aurora · Capítulo 1' });
});
test('native reader route works directly and detail route retains chapter list', async () => {
  window.history.replaceState({}, '', '/obras/archivo-aurora/capitulos/2?q=Aurora');
  const page = render(<CatalogApp readingApi={readingApi} />);
  await screen.findByRole('heading', { name: 'Archivo Aurora · Capítulo 2' });
  expect(screen.queryByRole('heading', { name: 'Tu próxima historia te espera' })).not.toBeInTheDocument();
  page.unmount(); window.history.replaceState({}, '', '/obras/archivo-aurora');
  render(<CatalogApp api={{ detail: vi.fn(async () => detail) }} readingApi={readingApi} />);
  await screen.findByRole('heading', { name: 'Archivo Aurora' });
  expect(await screen.findByRole('link', { name: 'Leer desde el primer capítulo' })).toBeInTheDocument();
});
