import path from 'node:path';
import { readdir, lstat, rm } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { createDemoCatalogRepository } from '../catalog/demo-repository.js';
import { chapterNumber, validId, text, pageNumber, pageFilename, LIMITS, fail, uuid } from './validation.js';
import { safePath, boundedRead, exclusiveWrite, privateDirectory, digest, exists, readJson } from './files.js';
import { normalizeImage } from './images.js';
import { archivePages } from './archive.js';
import { openStore, withLock, readManifest, publish } from './store.js';

async function inputs(input, limits) {
  input = await safePath(input, { outsideGit: true });
  const stat = await lstat(input);
  if (stat.isDirectory()) {
    const names = await readdir(input);
    if (!names.length || names.length > limits.pages) fail('Page count limit exceeded');
    const numbers = new Set();
    for (const name of names) {
      const number = pageNumber(name);
      if (numbers.has(number)) fail('Duplicate numeric page');
      numbers.add(number); await safePath(path.join(input, name));
      if (!(await lstat(path.join(input, name))).isFile()) fail('Expected regular image files');
    }
    names.sort((a,b) => pageNumber(a) - pageNumber(b));
    return { entries: names.map(name => ({ fileName: name })), read: entry => boundedRead(path.join(input, entry.fileName), limits.imageBytes), close() {} };
  }
  if (!stat.isFile()) fail('Input must be a regular image or ZIP/CBZ');
  if (/\.(zip|cbz)$/i.test(input)) return archivePages(await boundedRead(input, limits.archiveBytes), limits);
  pageNumber(path.basename(input));
  return { entries: [{ fileName: path.basename(input) }], read: () => boundedRead(input, limits.imageBytes), close() {} };
}
export async function importChapter(options, { limits: overrides = {}, beforePublish } = {}) {
  const limits = { ...LIMITS, ...overrides };
  const number = chapterNumber(options.number), workId = options.workId;
  if (!validId(workId) || !await createDemoCatalogRepository().findById(workId)) fail('Unknown work');
  const title = text(options.title ?? `Capítulo ${number}`);
  if (!['own', 'authorized'].includes(options.rights)) fail('Publication rights declaration required');
  const source = text(options.source, 500);
  await safePath(options.proof, { outsideGit: true });
  const proof = await boundedRead(options.proof, limits.proofBytes);
  const store = await openStore(options.root, { create: true });
  return withLock(store, async () => {
    if (await exists(path.join(store.root, 'chapters', workId, number))) fail('Duplicate chapter number');
    const sourcePages = await inputs(options.input, limits);
    const transactionId = randomUUID(), stage = path.join(store.root, '.staging', transactionId);
    try {
      await privateDirectory(stage);
      await exclusiveWrite(path.join(stage, 'transaction.json'), JSON.stringify({ schemaVersion: 1, storeId: store.storeId, transactionId, workId, number }));
      await exclusiveWrite(path.join(stage, 'authorization.bin'), proof);
      const pages = []; let inputBytes = 0, outputBytes = 0;
      if (sourcePages.entries.length > limits.pages) fail('Page count limit exceeded');
      for (const entry of sourcePages.entries) {
        const bytes = await sourcePages.read(entry); inputBytes += bytes.length;
        if (inputBytes > limits.expandedBytes) fail('Chapter input byte limit exceeded');
        const { buffer, width, height } = await normalizeImage(bytes, entry.fileName, { ...limits, outputBytes: limits.outputBytes - outputBytes });
        outputBytes += buffer.length;
        const index = pages.length + 1;
        await exclusiveWrite(path.join(stage, pageFilename(index)), buffer);
        pages.push({ index, width, height, bytes: buffer.length, sha256: digest(buffer) });
      }
      const manifest = { schemaVersion: 1, storeId: store.storeId, transactionId, workId, number, title, rights: { kind: options.rights, source, proofHash: digest(proof), proofBytes: proof.length }, pages };
      const serialized = Buffer.from(JSON.stringify(manifest));
      if (serialized.length > limits.manifestBytes) fail('Manifest size limit exceeded');
      await exclusiveWrite(path.join(stage, 'manifest.json'), serialized);
      await readManifest(store, stage, workId, number, { verify: true, limits, requireReady: false });
      await exclusiveWrite(path.join(stage, 'READY'), transactionId);
      await beforePublish?.();
      await publish(store, stage, manifest);
      return { workId, number, pageCount: pages.length };
    } finally { sourcePages.close(); }
  });
}
async function transactionInfo(store, id) {
  if (!uuid(id)) fail('Invalid transaction id');
  const directory = path.join(store.root, '.staging', id);
  const tx = await readJson(path.join(directory, 'transaction.json'), 4096);
  if (tx.schemaVersion !== 1 || tx.storeId !== store.storeId || tx.transactionId !== id || !validId(tx.workId) || chapterNumber(tx.number) !== tx.number) fail('Foreign or invalid transaction');
  return { directory, tx };
}
export async function importStatus(root) {
  const store = await openStore(root), transactions = [];
  for (const id of await readdir(path.join(root, '.staging'))) {
    try {
      const { directory, tx } = await transactionInfo(store, id);
      transactions.push({ id, workId: tx.workId, number: tx.number, ready: !!await exists(path.join(directory, 'READY')) });
    } catch {
      // Keep unverifiable data. One interrupted metadata write must not hide healthy transactions.
      transactions.push({ id: uuid(id) ? id : null, ready: false, state: 'unverified' });
    }
  }
  const lockFile = path.join(root, '.import.lock');
  let lock = null;
  if (await exists(lockFile)) {
    try { lock = await readJson(lockFile, 4096); }
    catch { lock = { state: 'unverified' }; }
  }
  return { transactions, lock };
}
export async function recoverImport({ root, transaction, action }) {
  const store = await openStore(root);
  if (!['finish', 'discard'].includes(action)) fail('Expected finish or discard action');
  return withLock(store, async () => {
    const { directory, tx } = await transactionInfo(store, transaction);
    if (action === 'discard') {
      // Only this UUID-owned staging transaction, never chapters or arbitrary paths.
      await rm(directory, { recursive: true }); return;
    }
    const ready = (await boundedRead(path.join(directory, 'READY'), 100)).toString();
    if (ready !== transaction) fail('Transaction is not ready');
    if (!await createDemoCatalogRepository().findById(tx.workId)) fail('Unknown work');
    const manifest = await readManifest(store, directory, tx.workId, tx.number, { verify: true });
    if (manifest.transactionId !== transaction) fail('Transaction mismatch');
    await publish(store, directory, manifest);
  });
}
