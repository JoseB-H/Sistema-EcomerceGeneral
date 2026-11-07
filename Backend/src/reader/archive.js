import yauzl from 'yauzl';
import { crc32 } from 'node:zlib';
import { pageNumber, fail } from './validation.js';

export async function archivePages(bytes, limits) {
  if (bytes.length > limits.archiveBytes || bytes.readUInt32LE(0) !== 0x04034b50) fail('Invalid or oversized ZIP/CBZ');
  const zip = await new Promise((resolve, reject) => yauzl.fromBuffer(bytes, { lazyEntries: true, autoClose: false, strictFileNames: true, validateEntrySizes: true }, (error, file) => error ? reject(error) : resolve(file)));
  const entries = [];
  try {
    await new Promise((resolve, reject) => {
      let total = 0, count = 0;
      zip.on('error', reject); zip.on('end', resolve);
      zip.on('entry', entry => {
        try {
          if (++count > limits.entries) fail('ZIP entry limit exceeded');
          const name = entry.fileName;
          if (!name || name.length > 200 || /[\\:\u0000-\u001f\u007f]/.test(name) || name.startsWith('/') || name.split('/').some(v => v === '.' || v === '..') || name.includes('//')) fail('Unsafe ZIP path');
          const mode = entry.externalFileAttributes >>> 16;
          const directory = name.endsWith('/');
          if ((mode & 0xf000) && (mode & 0xf000) !== (directory ? 0x4000 : 0x8000)) fail('ZIP link or special file rejected');
          if ((entry.generalPurposeBitFlag & 1) || ![0,8].includes(entry.compressionMethod)) fail('Encrypted or unsupported ZIP entry');
          const offset = entry.relativeOffsetOfLocalHeader;
          if (!Number.isSafeInteger(offset) || offset < 0 || offset + 30 > bytes.length || bytes.readUInt32LE(offset) !== 0x04034b50) fail('Invalid ZIP local header');
          const nameLength = bytes.readUInt16LE(offset + 26), extraLength = bytes.readUInt16LE(offset + 28);
          if (offset + 30 + nameLength + extraLength > bytes.length || bytes.readUInt16LE(offset + 6) !== entry.generalPurposeBitFlag || bytes.readUInt16LE(offset + 8) !== entry.compressionMethod || bytes.toString('utf8', offset + 30, offset + 30 + nameLength) !== name) fail('ZIP local/central header mismatch');
          if (!(entry.generalPurposeBitFlag & 8) && (bytes.readUInt32LE(offset + 14) !== entry.crc32 || bytes.readUInt32LE(offset + 18) !== entry.compressedSize || bytes.readUInt32LE(offset + 22) !== entry.uncompressedSize)) fail('ZIP local CRC/size mismatch');
          total += entry.uncompressedSize;
          if (entry.uncompressedSize > limits.imageBytes || total > limits.expandedBytes || entry.uncompressedSize / Math.max(1, entry.compressedSize) > limits.ratio) fail('ZIP expansion limit exceeded');
          if (directory) { if (entry.uncompressedSize !== 0) fail('Invalid ZIP directory'); }
          else { pageNumber(name.split('/').at(-1)); entries.push(entry); if (entries.length > limits.pages) fail('Page limit exceeded'); }
          zip.readEntry();
        } catch (error) { reject(error); }
      }); zip.readEntry();
    });
    if (!entries.length) fail('No chapter pages');
    const names = new Set(), numbers = new Set();
    for (const entry of entries) {
      const n = pageNumber(entry.fileName.split('/').at(-1));
      if (names.has(entry.fileName) || numbers.has(n)) fail('Duplicate numeric page');
      names.add(entry.fileName); numbers.add(n);
    }
    entries.sort((a, b) => pageNumber(a.fileName.split('/').at(-1)) - pageNumber(b.fileName.split('/').at(-1)));
    return { entries, async read(entry) {
      const stream = await new Promise((resolve, reject) => zip.openReadStream(entry, (error, s) => error ? reject(error) : resolve(s)));
      let total = 0, crc = 0; const chunks = [];
      for await (const chunk of stream) {
        total += chunk.length;
        if (total > limits.imageBytes || total > entry.uncompressedSize) { stream.destroy(); fail('ZIP actual byte limit exceeded'); }
        crc = crc32(chunk, crc); chunks.push(chunk);
      }
      if (total !== entry.uncompressedSize || crc !== entry.crc32) fail('ZIP size or CRC mismatch');
      return Buffer.concat(chunks, total);
    }, close: () => zip.close() };
  } catch (error) { zip.close(); throw error; }
}
