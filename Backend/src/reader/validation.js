export const LIMITS = Object.freeze({ imageBytes: 20 * 1024 ** 2, archiveBytes: 100 * 1024 ** 2, expandedBytes: 200 * 1024 ** 2, outputBytes: 512 * 1024 ** 2, proofBytes: 2 * 1024 ** 2, manifestBytes: 256 * 1024, pixels: 40_000_000, width: 16000, height: 40000, pages: 200, entries: 250, ratio: 100 });
export class ReaderValidationError extends Error {}
export const fail = message => { throw new ReaderValidationError(message); };
export function chapterNumber(value) {
  if (typeof value !== 'string' || !/^\d{1,6}(?:\.\d{1,3})?$/.test(value)) fail('Invalid chapter number');
  const [integer, fraction = ''] = value.split('.');
  const tail = fraction.replace(/0+$/, '');
  return `${Number(integer)}${tail ? `.${tail}` : ''}`;
}
const scaled = value => { const [n, d = ''] = chapterNumber(value).split('.'); return BigInt(n) * 1000n + BigInt(d.padEnd(3, '0')); };
export const compareChapters = (a, b) => scaled(a) < scaled(b) ? -1 : scaled(a) > scaled(b) ? 1 : 0;
export const validId = value => typeof value === 'string' && value.length <= 80 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
export const uuid = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(value);
export const hash = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
export function text(value, max = 200) {
  if (typeof value !== 'string' || !value.trim() || value.length > max || /[\u0000-\u001f\u007f]/.test(value)) fail('Invalid text');
  return value.trim();
}
export function pageNumber(filename) {
  const match = /^(\d{1,6})\.(png|jpe?g|webp)$/i.exec(filename);
  if (!match) fail('Expected numeric JPG, PNG or WebP page filename');
  return Number(match[1]);
}
export const pageFilename = index => `${String(index).padStart(4, '0')}.png`;
export function validateManifest(m, workId, number, limits = LIMITS) {
  if (!m || m.schemaVersion !== 1 || m.workId !== workId || m.number !== number || !validId(m.workId) || chapterNumber(m.number) !== m.number) fail('Invalid chapter manifest');
  text(m.title); if (!uuid(m.storeId) || !uuid(m.transactionId)) fail('Invalid manifest identity');
  if (!['own', 'authorized'].includes(m.rights?.kind) || !hash(m.rights.proofHash) || !Number.isSafeInteger(m.rights.proofBytes) || m.rights.proofBytes < 1 || m.rights.proofBytes > limits.proofBytes) fail('Invalid rights manifest');
  text(m.rights.source, 500);
  if (!Array.isArray(m.pages) || !m.pages.length || m.pages.length > limits.pages) fail('Invalid manifest pages');
  let bytes = 0;
  m.pages.forEach((p, i) => {
    if (p.index !== i + 1 || !Number.isInteger(p.width) || !Number.isInteger(p.height) || p.width < 1 || p.height < 1 || p.width > limits.width || p.height > limits.height || p.width * p.height > limits.pixels || !hash(p.sha256) || !Number.isSafeInteger(p.bytes) || p.bytes < 1) fail('Invalid page manifest');
    bytes += p.bytes;
  });
  if (bytes > limits.outputBytes) fail('Chapter output limit exceeded');
  return m;
}
