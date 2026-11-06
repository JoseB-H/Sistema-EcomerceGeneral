import { test, expect } from 'vitest';
import { isCatalogLocation, exploreHref, workHref } from '../src/catalog/catalog-navigation.js';

test('separates editorial home from Explore and preserves legacy catalog URLs', () => {
  expect(isCatalogLocation('/', '')).toBe(false);
  expect(isCatalogLocation('/', '?utm_source=local')).toBe(false);
  for (const search of ['?q=Aurora', '?format=manhwa', '?q=&format=']) {
    expect(isCatalogLocation('/', search)).toBe(true);
  }
  expect(isCatalogLocation('/explorar', '')).toBe(true);
  expect(isCatalogLocation('/obras/archivo-aurora', '?q=Aurora')).toBe(false);
});

test('creates canonical links that retain search, format and encoded identifiers', () => {
  expect(exploreHref()).toBe('/explorar');
  expect(exploreHref({ query: 'Ciencia ficción', format: 'manhwa' })).toBe('/explorar?q=Ciencia+ficci%C3%B3n&format=manhwa');
  expect(workHref({ id: 'archivo-aurora', query: 'Órbita', format: 'manhwa' })).toBe('/obras/archivo-aurora?q=%C3%93rbita&format=manhwa');
  expect(workHref({ id: 'obra/otra' })).toBe('/obras/obra%2Fotra');
});
