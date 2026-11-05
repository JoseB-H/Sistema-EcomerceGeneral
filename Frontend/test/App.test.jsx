import React from 'react';
import { test, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../src/App.jsx';

const healthy = { status: 'ok', database: 'ok' };
afterEach(() => vi.useRealTimers());

test('renders_loading_then_real_health', async () => {
  let release;
  render(<App loadHealth={() => new Promise(resolve => { release = resolve; })} />);
  expect(screen.getByRole('status')).toHaveTextContent('Comprobando conexión…');
  expect(screen.getByRole('button')).toBeDisabled();
  await act(async () => release(healthy));
  expect(screen.getByRole('status')).toHaveTextContent('Backend y PostgreSQL disponibles');
});

test('replaces_success_with_error and retry_recovers', async () => {
  let attempts = 0;
  render(<App loadHealth={async () => { if (++attempts === 2) throw new Error('sensitive-message'); return healthy; }} />);
  await screen.findByText('Backend y PostgreSQL disponibles');
  fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo comprobar la conexión');
  expect(screen.queryByText('Backend y PostgreSQL disponibles')).not.toBeInTheDocument();
  expect(screen.queryByText('sensitive-message')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button'));
  expect(await screen.findByRole('status')).toHaveTextContent('Backend y PostgreSQL disponibles');
});

test('aborts_on_unmount and ignores_old_response', async () => {
  let signal;
  let release;
  const old = render(<App loadHealth={options => {
    signal = options.signal;
    return new Promise(resolve => { release = resolve; });
  }} />);
  old.unmount();
  expect(signal.aborted).toBe(true);
  render(<App loadHealth={async () => { throw new Error('offline'); }} />);
  await screen.findByRole('alert');
  await act(async () => release(healthy));
  expect(screen.queryByText('Backend y PostgreSQL disponibles')).not.toBeInTheDocument();
});

test('request_timeout_allows_retry even if dependency ignores cancellation', async () => {
  vi.useFakeTimers();
  let signal;
  let attempts = 0;
  render(<App loadHealth={options => {
    signal = options.signal;
    return ++attempts === 1 ? new Promise(() => {}) : Promise.resolve(healthy);
  }} />);
  await act(async () => vi.advanceTimersByTime(4000));
  expect(signal.aborted).toBe(true);
  expect(screen.getByRole('alert')).toHaveTextContent('No se pudo comprobar la conexión');
  await act(async () => fireEvent.click(screen.getByRole('button')));
  expect(screen.getByRole('status')).toHaveTextContent('Backend y PostgreSQL disponibles');
});
