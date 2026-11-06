import { test, expect } from 'vitest';
import { deriveHomeSections } from '../src/catalog/home-sections.js';
import { work } from './catalog-fixtures.js';

test('derives editorial sections and unique genres only from the received works', () => {
  const works = Array.from({ length: 6 }, (_, index) => Object.freeze({ ...work, id: `test-${index}`, genres: index % 2 ? ['Aventura', 'Ciencia ficción'] : ['Ciencia ficción'] }));
  Object.freeze(works);
  const result = deriveHomeSections(works);
  expect(result.featured).toBe(works[0]);
  expect(result.discovery).toEqual(works.slice(1, 4));
  expect(result.selection).toEqual(works.slice(4));
  expect(result.categories).toEqual(['Ciencia ficción', 'Aventura']);
  expect([result.featured, ...result.discovery, ...result.selection]).toEqual(works);
});

test('does not invent titles or categories for empty and small responses', () => {
  expect(deriveHomeSections([])).toEqual({ featured: null, discovery: [], selection: [], categories: [] });
  expect(deriveHomeSections([work])).toEqual({ featured: work, discovery: [], selection: [], categories: work.genres });
});
