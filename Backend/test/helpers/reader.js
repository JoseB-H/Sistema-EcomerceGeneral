import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { crc32, deflateRawSync } from 'node:zlib';
import sharp from 'sharp';

export async function fixture(t) {
  const base = await mkdtemp(path.join(tmpdir(), 'yitverse-reader-test-'));
  t.after(() => rm(base, { recursive: true, force: true }));
  const input = path.join(base, 'input');
  await mkdir(input);
  const proof = path.join(base, 'own.txt');
  await writeFile(proof, 'Synthetic original fixture; test-only publication authorization.');
  const png = await sharp({ create: { width: 48, height: 96, channels: 3, background: '#7545D0' } }).png().toBuffer();
  const options = { root: path.join(base, 'store'), input, proof, workId: 'archivo-aurora', number: '1', title: 'Prueba original', rights: 'own', source: 'Original synthetic test images' };
  return { base, input, proof, png, options };
}

// Stored ZIP fixture: small, deterministic, no external fixture/archive dependency.
export function zip(entries) {
  const local = [], central = [];
  let offset = 0;
  for (const { name, data = Buffer.alloc(0), checksum, attributes = 0, flags = 0, method = 0 } of entries) {
    const filename = Buffer.from(name);
    const compressed = method === 8 ? deflateRawSync(data) : data;
    const crc = checksum ?? crc32(data);
    const h = Buffer.alloc(30); h.writeUInt32LE(0x04034b50); h.writeUInt16LE(20, 4);
    h.writeUInt16LE(flags, 6); h.writeUInt16LE(method, 8); h.writeUInt32LE(crc, 14);
    h.writeUInt32LE(compressed.length, 18); h.writeUInt32LE(data.length, 22); h.writeUInt16LE(filename.length, 26);
    local.push(h, filename, compressed);
    const c = Buffer.alloc(46); c.writeUInt32LE(0x02014b50); c.writeUInt16LE(0x0314, 4); c.writeUInt16LE(20, 6);
    c.writeUInt16LE(flags, 8); c.writeUInt16LE(method, 10); c.writeUInt32LE(crc, 16);
    c.writeUInt32LE(compressed.length, 20); c.writeUInt32LE(data.length, 24); c.writeUInt16LE(filename.length, 28);
    c.writeUInt32LE(attributes >>> 0, 38); c.writeUInt32LE(offset, 42); central.push(c, filename);
    offset += h.length + filename.length + compressed.length;
  }
  const directory = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, directory, end]);
}

function pngChunk(type, data) {
  const name = Buffer.from(type), length = Buffer.alloc(4), checksum = Buffer.alloc(4);
  length.writeUInt32BE(data.length); checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, checksum]);
}
export function animatedPng(png) {
  const frames = Buffer.alloc(8); frames.writeUInt32BE(2);
  const header = png.subarray(16, 29), idat = [];
  for (let i = 8; i < png.length;) {
    const length = png.readUInt32BE(i), type = png.toString('ascii', i + 4, i + 8);
    if (type === 'IDAT') idat.push(png.subarray(i + 8, i + 8 + length));
    i += length + 12;
  }
  const frame = sequence => {
    const data = Buffer.alloc(26); data.writeUInt32BE(sequence); header.copy(data, 4, 0, 8);
    data.writeUInt16BE(1, 20); data.writeUInt16BE(10, 22); return data;
  };
  const sequence = Buffer.alloc(4); sequence.writeUInt32BE(2);
  return Buffer.concat([png.subarray(0, 8), pngChunk('IHDR', header), pngChunk('acTL', frames), pngChunk('fcTL', frame(0)), pngChunk('IDAT', Buffer.concat(idat)), pngChunk('fcTL', frame(1)), pngChunk('fdAT', Buffer.concat([sequence, ...idat])), pngChunk('IEND', Buffer.alloc(0))]);
}
