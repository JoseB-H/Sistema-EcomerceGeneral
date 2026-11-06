import React from 'react';
import { beforeEach, test, expect } from 'vitest';
import { render, screen, within, act, fireEvent } from '@testing-library/react';
import HomePage from '../src/catalog/HomePage.jsx';
import CatalogApp from '../src/catalog/CatalogApp.jsx';
import Hero from '../src/catalog/Hero.jsx';
import { work, collection, detail, source } from './catalog-fixtures.js';

const items = Array.from({ length: 6 }, (_, index) => ({ ...work, id: `obra-${index}`, title: `Historia de muestra ${index}`, genres: index % 2 ? ['Misterio', 'Aventura'] : ['Misterio'] }));
beforeEach(() => window.history.replaceState({}, '', '/'));

test('featured stories show every API work once in its received order without ranking', async () => {
  render(<HomePage api={{ list: async () => ({ source, items }) }} />);
  const region = within(await screen.findByRole('region', { name: 'Historias destacadas' }));
  expect(region.getAllByRole('link', { name: /Ver ficha de/ }).map(link => link.getAttribute('href'))).toEqual([
    '/obras/obra-0', '/obras/obra-1', '/obras/obra-2', '/obras/obra-3', '/obras/obra-4', '/obras/obra-5',
  ]);
  expect(region.getAllByRole('article')).toHaveLength(6);
  expect(region.getByText(/orden del catálogo/i)).toBeInTheDocument();
  expect(region.queryByText(/popular|ranking|capítulos|actualizado/i)).not.toBeInTheDocument();
});

test('hero presents existing clean genres and a working discovery action', () => {
  render(<Hero work={{ ...work, genres: [' Misterio ', '', 'Misterio', 'Ciencia ficción'] }} />);
  const genres = within(screen.getByRole('list', { name: 'Géneros de la obra destacada' }));
  expect(genres.getAllByRole('listitem').map(item => item.textContent)).toEqual(['Misterio', 'Ciencia ficción']);
  expect(screen.getByRole('link', { name: 'Descubrir Archivo Aurora' })).toHaveAttribute('href', '/obras/archivo-aurora');
});

test('genre discovery precedes featured stories and uses the existing query route', async () => {
  render(<HomePage api={{ list: async () => ({ source, items }) }} />);
  const featured = await screen.findByRole('region', { name: 'Historias destacadas' });
  const genres = screen.getByRole('region', { name: 'Descubre por género' });
  expect(genres.compareDocumentPosition(featured) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(within(genres).getByRole('link', { name: /Misterio/ })).toHaveAttribute('href', '/explorar?q=Misterio');
});

test('new editorial selection waits for the API and omits empty data', async () => {
  let complete;
  render(<HomePage api={{ list: () => new Promise(resolve => { complete = resolve; }) }} />);
  expect(screen.getByRole('status')).toBeInTheDocument();
  expect(screen.queryByRole('region', { name: 'Historias destacadas' })).not.toBeInTheDocument();
  await act(async () => complete({ source, items: [] }));
  expect(screen.getByRole('heading', { name: 'Todavía no hay obras para explorar' })).toBeInTheDocument();
  expect(screen.queryByRole('region', { name: 'Historias destacadas' })).not.toBeInTheDocument();
  expect(screen.queryByRole('region', { name: 'Descubre por género' })).not.toBeInTheDocument();
});

test('a failed editorial request does not invent cards and retry restores the complete selection', async () => {
  let attempts = 0;
  render(<HomePage api={{ list: async () => { if (++attempts === 1) throw new Error('private'); return { source, items }; } }} />);
  expect(await screen.findByRole('alert')).toBeInTheDocument();
  expect(screen.queryByRole('region', { name: 'Historias destacadas' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
  expect(within(await screen.findByRole('region', { name: 'Historias destacadas' })).getAllByRole('article')).toHaveLength(6);
});

test.each(['/', '/explorar', '/obras/archivo-aurora', '/ruta-desconocida'])('the final discovery invitation uses only a real destination on %s', async path => {
  window.history.replaceState({}, '', path);
  render(<CatalogApp api={{ list: async () => collection, detail: async () => detail }} />);
  const invitation = within(screen.getByRole('region', { name: 'Tu próxima historia te espera' }));
  expect(invitation.getByRole('link', { name: /Descubrir el catálogo/ })).toHaveAttribute('href', '/explorar');
  expect(screen.queryByRole('button', { name: /leer|favoritos|biblioteca|cuenta/i })).not.toBeInTheDocument();
  await act(async () => {});
});
