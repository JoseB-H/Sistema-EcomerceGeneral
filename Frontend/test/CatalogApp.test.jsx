import React from 'react';
import { test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CatalogApp from '../src/catalog/CatalogApp.jsx';
import { collection, detail, source } from './catalog-fixtures.js';

const api = { list: async () => collection, detail: async () => detail };
beforeEach(() => window.history.replaceState({}, '', '/'));
afterEach(() => vi.useRealTimers());

test('catalog announces loading and then identifies synthetic works', async () => {
  let complete;
  render(<CatalogApp api={{ ...api, list: () => new Promise(resolve => { complete = resolve; }) }} />);
  expect(screen.getByRole('status')).toHaveTextContent('Cargando catálogo');
  await act(async () => complete(collection));
  expect(screen.getByRole('link', { name: /Ver ficha de Archivo Aurora/i })).toHaveAttribute('href', '/obras/archivo-aurora');
  expect(screen.getByText(/todas las obras son ficticias/i)).toBeInTheDocument();
});

test('search and format update results and URL without losing the filter on detail links', async () => {
  const calls = [];
  render(<CatalogApp api={{ ...api, list: async options => { calls.push(options); return collection; } }} />);
  await screen.findByRole('link', { name: /Ver ficha de Archivo Aurora/ });
  fireEvent.change(screen.getByRole('searchbox', { name: /Buscar obras/ }), { target: { value: 'Aurora' } });
  fireEvent.change(screen.getByRole('combobox', { name: /Formato/ }), { target: { value: 'manga' } });
  fireEvent.submit(screen.getByRole('search'));
  await act(async () => {});
  expect(calls.at(-1)).toMatchObject({ query: 'Aurora', format: 'manga' });
  expect(window.location.search).toBe('?q=Aurora&format=manga');
  expect(screen.getByRole('link', { name: /Ver ficha de Archivo Aurora/ }).getAttribute('href')).toBe('/obras/archivo-aurora?q=Aurora&format=manga');
});

test('empty results can clear the search', async () => {
  window.history.replaceState({}, '', '/?q=nada');
  render(<CatalogApp api={{ ...api, list: async ({ query }) => query ? { source, items: [] } : collection }} />);
  expect(await screen.findByText(/No encontramos obras/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Limpiar búsqueda/ }));
  await screen.findByRole('link', { name: /Ver ficha de Archivo Aurora/ });
  expect(window.location.search).toBe('');
});

test('catalog error is controlled and retry recovers', async () => {
  let attempts = 0;
  render(<CatalogApp api={{ ...api, list: async () => { if (++attempts === 1) throw new Error('sensitive-provider-text'); return collection; } }} />);
  expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo cargar el catálogo');
  expect(screen.queryByText('sensitive-provider-text')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
  await screen.findByRole('link', { name: /Ver ficha de Archivo Aurora/ });
});

test('direct detail uses its real identifier and returns to the filtered catalog', async () => {
  window.history.replaceState({}, '', '/obras/archivo-aurora?q=Aurora&format=manga');
  const ids = [];
  render(<CatalogApp api={{ ...api, detail: async id => { ids.push(id); return detail; } }} />);
  expect(screen.getByRole('status')).toHaveTextContent('Cargando ficha');
  expect(await screen.findByRole('heading', { level: 1, name: 'Archivo Aurora' })).toBeInTheDocument();
  expect(ids).toEqual(['archivo-aurora']);
  expect(screen.getByRole('link', { name: /Volver al catálogo/ })).toHaveAttribute('href', '/?q=Aurora&format=manga');
  expect(screen.getByText(detail.item.synopsis)).toBeInTheDocument();
});

test('unknown work shows a clear not-found state', async () => {
  window.history.replaceState({}, '', '/obras/no-existe');
  render(<CatalogApp api={{ ...api, detail: async () => { throw Object.assign(new Error('missing'), { code: 'not_found' }); } }} />);
  expect(await screen.findByRole('heading', { name: 'No encontramos esta obra' })).toBeInTheDocument();
});

test('unknown page does not render a fictitious work', () => {
  window.history.replaceState({}, '', '/ruta-inexistente');
  render(<CatalogApp api={api} />);
  expect(screen.getByRole('heading', { name: 'Esta página no existe' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Ver ficha de/ })).not.toBeInTheDocument();
});

test('changing search cancels and ignores an older in-flight result', async () => {
  let firstSignal;
  let completeOld;
  render(<CatalogApp api={{ ...api, list: options => {
    if (!options.query) {
      firstSignal = options.signal;
      return new Promise(resolve => { completeOld = resolve; });
    }
    return Promise.resolve({ source, items: [] });
  } }} />);
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'nada' } });
  fireEvent.submit(screen.getByRole('search'));
  expect(firstSignal.aborted).toBe(true);
  await screen.findByText(/No encontramos obras/);
  await act(async () => completeOld(collection));
  expect(screen.queryByRole('link', { name: /Ver ficha de Archivo Aurora/ })).not.toBeInTheDocument();
});

test('detail provider failure offers retry', async () => {
  window.history.replaceState({}, '', '/obras/archivo-aurora');
  let calls = 0;
  render(<CatalogApp api={{ ...api, detail: async () => { if (++calls === 1) throw new Error('offline'); return detail; } }} />);
  expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo cargar la ficha');
  fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
  await screen.findByRole('heading', { name: 'Archivo Aurora' });
});

test('unmounted catalog cancels the request and ignores late results', async () => {
  let signal;
  let complete;
  const old = render(<CatalogApp api={{ ...api, list: options => { signal = options.signal; return new Promise(resolve => { complete = resolve; }); } }} />);
  old.unmount();
  expect(signal.aborted).toBe(true);
  render(<CatalogApp api={{ ...api, list: async () => ({ source, items: [] }) }} />);
  await screen.findByText(/No encontramos obras/);
  await act(async () => complete(collection));
  expect(screen.queryByRole('link', { name: /Ver ficha de Archivo Aurora/ })).not.toBeInTheDocument();
});

test('timeout leaves loading and retry works even when a provider ignores abort', async () => {
  vi.useFakeTimers();
  let attempts = 0;
  let signal;
  render(<CatalogApp api={{ ...api, list: options => { signal = options.signal; return ++attempts === 1 ? new Promise(() => {}) : Promise.resolve(collection); } }} />);
  await act(async () => vi.advanceTimersByTime(4000));
  expect(signal.aborted).toBe(true);
  expect(screen.getByRole('alert')).toHaveTextContent('No se pudo cargar el catálogo');
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Reintentar' })));
  expect(screen.getByRole('link', { name: /Ver ficha de Archivo Aurora/ })).toBeInTheDocument();
});
