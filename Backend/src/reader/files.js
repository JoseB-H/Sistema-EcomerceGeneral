import { constants } from 'node:fs';
import { lstat, realpath, open, mkdir, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { fail } from './validation.js';

export const repositoryRoot = fileURLToPath(new URL('../../../', import.meta.url));
export const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export async function exists(file) { try { return await lstat(file); } catch (e) { if (e.code === 'ENOENT') return null; throw e; } }
const contains = (parent, child) => { const r = path.relative(parent, child); return !r || (!r.startsWith(`..${path.sep}`) && r !== '..' && !path.isAbsolute(r)); };
export async function safePath(value, { allowMissing = false, outsideGit = false } = {}) {
  if (typeof value !== 'string' || !path.isAbsolute(value) || value.includes('\0') || /^[/\\]{2}/.test(value) || /^[a-z]+:\/\//i.test(value)) fail('Expected absolute local path');
  const absolute = path.resolve(value);
  if (outsideGit && (contains(repositoryRoot, absolute) || contains(absolute, repositoryRoot))) fail('Store must be outside repository');
  let current = path.parse(absolute).root;
  const components = absolute.slice(current.length).split(path.sep).filter(Boolean);
  for (const component of components) {
    current = path.join(current, component);
    const stat = await exists(current);
    if (stat?.isSymbolicLink()) fail('Symbolic link paths are forbidden');
    if (!stat && !allowMissing) fail('Local path does not exist');
    if (stat && await realpath(current) !== current) fail('Noncanonical link path');
    if (outsideGit && (!stat || stat.isDirectory())) {
      const git = path.join(current, '.git'), metadata = await exists(git);
      // Managed sandboxes may create empty read-only mount points called .git.
      // A worktree gitfile, link, or nonempty metadata directory denotes a repository.
      if (metadata && (!metadata.isDirectory() || (await readdir(git)).length)) fail('Store must be outside Git');
    }
  }
  return absolute;
}
export async function boundedRead(file, max) {
  await safePath(file);
  const stat = await lstat(file);
  if (!stat.isFile() || stat.size < 1 || stat.size > max) fail('File size or type limit exceeded');
  const handle = await open(file, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const actual = await handle.stat();
    if (!actual.isFile() || actual.dev !== stat.dev || actual.ino !== stat.ino || actual.size !== stat.size) fail('File changed during read');
    const chunks = []; let total = 0;
    for (;;) {
      const buffer = Buffer.alloc(Math.min(65536, max + 1 - total));
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, null);
      if (!bytesRead) break;
      total += bytesRead; if (total > max) fail('File byte limit exceeded');
      chunks.push(buffer.subarray(0, bytesRead));
    }
    if (total !== stat.size) fail('File changed during read');
    return Buffer.concat(chunks, total);
  } finally { await handle.close(); }
}
export const privateDirectory = file => mkdir(file, { recursive: true, mode: 0o700 });
export const exclusiveWrite = (file, bytes) => writeFile(file, bytes, { flag: 'wx', mode: 0o600 });
export async function readJson(file, max) { return JSON.parse((await boundedRead(file, max)).toString('utf8')); }
