import { readdir, rename, unlink } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { hostname } from 'node:os';
import path from 'node:path';
import { safePath, exists, privateDirectory, exclusiveWrite, readJson, boundedRead, digest } from './files.js';
import { LIMITS, uuid, fail, validateManifest, pageFilename } from './validation.js';
import { normalizeImage } from './images.js';

const marker = '.yitverse-reader-store.json';
export async function openStore(root, { create = false } = {}) {
  root = await safePath(root, { allowMissing: create, outsideGit: true });
  if (create) {
    await privateDirectory(root);
    if (!await exists(path.join(root, marker))) {
      if ((await readdir(root)).length) fail('Store must be empty or owned');
      await exclusiveWrite(path.join(root, marker), JSON.stringify({ schemaVersion: 1, storeId: randomUUID() }));
    }
  }
  const info = await readJson(path.join(root, marker), 4096);
  if (info.schemaVersion !== 1 || !uuid(info.storeId)) fail('Invalid store marker');
  for (const name of ['chapters', '.staging']) {
    const location = path.join(root, name);
    if (create) await privateDirectory(location);
    await safePath(location);
  }
  return { root, storeId: info.storeId };
}
export async function withLock(store, run) {
  const file = path.join(store.root, '.import.lock');
  const lock = { token: randomUUID(), storeId: store.storeId, pid: process.pid, hostname: hostname() };
  try { await exclusiveWrite(file, JSON.stringify(lock)); } catch (e) { if (e.code === 'EEXIST') fail('Store import is locked; inspect status'); throw e; }
  try { return await run(); } finally {
    const current = await readJson(file, 4096);
    if (current.token !== lock.token || current.storeId !== store.storeId) fail('Lock ownership changed; do not remove it');
    await unlink(file);
  }
}
export async function unlockStore(root, token) {
  const store = await openStore(root), file = path.join(root, '.import.lock');
  const lock = await readJson(file, 4096);
  if (!uuid(token) || lock.token !== token || lock.storeId !== store.storeId || lock.hostname !== hostname() || !Number.isSafeInteger(lock.pid) || lock.pid < 1) fail('Cannot verify stale lock ownership');
  try { process.kill(lock.pid, 0); fail('Lock process is still running'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
  // Keep the exact stale lock for diagnosis; never overwrite or clear by age alone.
  const archived = path.join(root, `.stale-lock-${token}.json`);
  const serialized = Buffer.from(JSON.stringify(lock));
  if (await exists(archived)) {
    if (!(await boundedRead(archived, 4096)).equals(serialized)) fail('Stale lock archive differs');
  } else await exclusiveWrite(archived, serialized);
  if (JSON.stringify(await readJson(file, 4096)) !== serialized.toString()) fail('Lock changed');
  await unlink(file);
}
export async function readManifest(store, directory, workId, number, { verify = false, limits = LIMITS, requireReady = true } = {}) {
  await safePath(directory);
  const m = validateManifest(await readJson(path.join(directory, 'manifest.json'), limits.manifestBytes), workId, number, limits);
  if (m.storeId !== store.storeId) fail('Foreign chapter manifest');
  if (requireReady && (await boundedRead(path.join(directory, 'READY'), 100)).toString() !== m.transactionId) fail('Incomplete chapter');
  const proof = await boundedRead(path.join(directory, 'authorization.bin'), limits.proofBytes);
  if (proof.length !== m.rights.proofBytes || digest(proof) !== m.rights.proofHash) fail('Authorization proof mismatch');
  if (verify) {
    for (const p of m.pages) {
      const buffer = await boundedRead(path.join(directory, pageFilename(p.index)), limits.outputBytes);
      if (buffer.length !== p.bytes || digest(buffer) !== p.sha256) fail('Page integrity mismatch');
      const decoded = await normalizeImage(buffer, pageFilename(p.index), { ...limits, imageBytes: limits.outputBytes });
      if (decoded.width !== p.width || decoded.height !== p.height) fail('Page dimensions mismatch');
    }
  }
  return m;
}
export async function publish(store, stage, manifest) {
  const parent = path.join(store.root, 'chapters', manifest.workId);
  await privateDirectory(parent); await safePath(parent);
  const destination = path.join(parent, manifest.number);
  if (await exists(destination)) fail('Duplicate chapter number; destination exists');
  // Same filesystem, exclusive cooperative lock. No fallback copy and no replacement of existing data.
  await rename(stage, destination);
}
