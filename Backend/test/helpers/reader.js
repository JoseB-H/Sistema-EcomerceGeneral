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
