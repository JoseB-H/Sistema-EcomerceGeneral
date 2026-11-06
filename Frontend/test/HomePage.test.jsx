import React from 'react';
import { test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import HomePage from '../src/catalog/HomePage.jsx';
import { work, source } from './catalog-fixtures.js';

const items = Array.from({ length: 6 }, (_, index) => ({ ...work, id: `prueba-${index}`, title: `Relato ficticio ${index}`, genres: index % 2 ? ['Aventura', 'Ciencia ficción'] : ['Ciencia ficción'] }));
beforeEach(() => window.history.replaceState({}, '', '/'));

test('home waits for the API before presenting real received titles and sections', async () => {
  let complete;
  const list = vi.fn(() => new Promise(resolve => { complete = resolve; }));
  render(<HomePage api={{ list }} />);
  expect(screen.getByRole('status')).toHaveTextContent('Cargando catálogo');
  expect(screen.queryByText('Relato ficticio 0')).not.toBeInTheDocument();
  await act(async () => complete({ source, items }));
  expect(list.mock.calls[0][0].signal).toBeInstanceOf(AbortSignal);
  expect(screen.getByRole('heading', { level: 1, name: 'Relato ficticio 0' })).toBeInTheDocument();
  const discovery = within(screen.getByRole('region', { name: 'Continuar explorando' }));
  expect(discovery.getAllByRole('link', { name: /Ver ficha de/ })).toHaveLength(3);
  expect(discovery.getByRole('heading', { level: 3, name: 'Relato ficticio 1' })).toBeInTheDocument();
  expect(discovery.getByText(/sin historial personal/i)).toBeInTheDocument();
  expect(within(screen.getByRole('region', { name: 'Selección de demostración' })).getAllByRole('link', { name: /Ver ficha de/ })).toHaveLength(2);
  const genres = within(screen.getByRole('region', { name: 'Descubre por género' }));
  expect(genres.getAllByRole('link')).toHaveLength(2);
  expect(genres.getByRole('link', { name: /Ciencia ficción/ })).toHaveAttribute('href', '/explorar?q=Ciencia+ficci%C3%B3n');
});

test('home search sends trimmed query and format to the canonical Explore route', async () => {
  const navigate = vi.fn();
  render(<HomePage api={{ list: async () => ({ source, items }) }} navigate={navigate} />);
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: ' Órbita ' } });
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'manhwa' } });
  fireEvent.submit(screen.getByRole('search'));
  expect(navigate).toHaveBeenCalledWith('/explorar?q=%C3%93rbita&format=manhwa');
  await screen.findByRole('heading', { level: 1, name: 'Relato ficticio 0' });
});

test('home reports API failure without fabricated content and retry recovers', async () => {
  let attempts = 0;
  render(<HomePage api={{ list: async () => { if (++attempts === 1) throw new Error('private-error'); return { source, items }; } }} />);
  expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo cargar el catálogo');
  expect(screen.queryByText('private-error')).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Ver ficha de/ })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
  await screen.findByRole('heading', { level: 1, name: 'Relato ficticio 0' });
});

test('an empty home offers Explore without inventing a featured work', async () => {
  render(<HomePage api={{ list: async () => ({ source, items: [] }) }} />);
  expect(await screen.findByRole('heading', { name: 'Todavía no hay obras para explorar' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Explorar catálogo' })).toHaveAttribute('href', '/explorar');
  expect(screen.queryByRole('link', { name: /Ver ficha de/ })).not.toBeInTheDocument();
  expect(screen.queryByRole('region', { name: 'Descubre por género' })).not.toBeInTheDocument();
});
