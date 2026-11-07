import path from 'node:path';
import { readdir } from 'node:fs/promises';
import { openStore, readManifest } from './store.js';
import { chapterNumber, compareChapters, pageFilename, LIMITS, fail } from './validation.js';
import { exists, safePath, boundedRead, digest } from './files.js';

const summary = m => ({ number: m.number, title: m.title, pageCount: m.pages.length });
export function createReaderRepository({ root } = {}) {
  return {
    source: Object.freeze({ kind: 'local-manifest', configured: !!root }),
    async list(workId) {
      if (!root) return [];
      const store = await openStore(root), directory = path.join(root, 'chapters', workId);
      if (!await exists(directory)) return [];
      await safePath(directory);
      const numbers = await readdir(directory);
      if (numbers.length > 10000) fail('Chapter count limit exceeded');
      const chapters = [];
      for (const n of numbers) {
        if (chapterNumber(n) !== n) fail('Noncanonical chapter directory');
        const m = await readManifest(store, path.join(directory, n), workId, n);
        if ((await boundedRead(path.join(directory, n, 'READY'), 100)).toString() !== m.transactionId) fail('Incomplete chapter');
        chapters.push(summary(m));
      }
      return chapters.sort((a,b) => compareChapters(a.number, b.number));
    },
    async detail(workId, number) {
      if (!root) return null;
      const store = await openStore(root), directory = path.join(root, 'chapters', workId, number);
      if (!await exists(directory)) return null;
      const m = await readManifest(store, directory, workId, number);
      return { chapter: summary(m), pages: m.pages.map(({ index, width, height }) => ({ index, width, height })) };
    },
    async page(workId, number, index) {
      if (!root) return null;
      const store = await openStore(root), directory = path.join(root, 'chapters', workId, number);
      if (!await exists(directory)) return null;
      const m = await readManifest(store, directory, workId, number);
      const page = m.pages[index - 1];
      if (!page) return null;
      const buffer = await boundedRead(path.join(directory, pageFilename(index)), Math.min(page.bytes, LIMITS.outputBytes));
      if (digest(buffer) !== page.sha256 || buffer.length !== page.bytes || !buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) fail('Page integrity mismatch');
      return buffer;
    },
  };
}
