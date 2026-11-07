import path from 'node:path';
import sharp from 'sharp';
import { fail } from './validation.js';

function signature(bytes) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'png';
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'jpeg';
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  fail('Invalid image signature');
}
export async function normalizeImage(bytes, filename, limits) {
  if (bytes.length > limits.imageBytes) fail('Image byte limit exceeded');
  const expected = { '.png': 'png', '.jpg': 'jpeg', '.jpeg': 'jpeg', '.webp': 'webp' }[path.extname(filename).toLowerCase()];
  if (!expected || signature(bytes) !== expected) fail('Image extension/type mismatch');
  const options = { limitInputPixels: limits.pixels, failOn: 'warning', animated: true };
  const metadata = await sharp(bytes, options).metadata();
  if (metadata.format !== expected || (metadata.pages ?? 1) !== 1 || metadata.width > limits.width || metadata.height > limits.height || metadata.width * metadata.height > limits.pixels) fail('Image dimensions or animation rejected');
  // Full decode strips metadata and gives a single trusted media format. Bound output while streaming.
  const image = sharp(bytes, options).rotate().png().timeout({ seconds: 15 });
  const chunks = []; let size = 0;
  for await (const chunk of image) {
    size += chunk.length; if (size > limits.outputBytes) { image.destroy(); fail('Output byte limit exceeded'); }
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks, size);
  const decoded = await sharp(buffer).metadata();
  return { buffer, width: decoded.width, height: decoded.height };
}
