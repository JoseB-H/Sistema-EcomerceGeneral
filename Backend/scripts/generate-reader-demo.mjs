#!/usr/bin/env node
// Only original procedural artwork and text. No network, external assets or catalog modifications.
import { parseArgs } from 'node:util';
import path from 'node:path';
import sharp from 'sharp';
import { safePath, exists, privateDirectory, exclusiveWrite } from '../src/reader/files.js';
import { importChapter } from '../src/reader/importer.js';

const stories = [
  { number: '1', title: 'El primer pliegue', lines: ['En una ciudad suspendida, un mapa dejó de responder.', 'Lía dobló una hoja y le dibujó un horizonte.', 'El pequeño satélite encontró un camino entre las nubes.'] },
  { number: '2', title: 'La señal de las azoteas', lines: ['Una luz violeta apareció sobre los tejados.', 'No era una estrella: alguien respondía desde otra isla.', 'Lía trazó una nueva órbita en el margen del mapa.'] },
  { number: '10', title: 'Un cielo por dibujar', lines: ['El mapa estaba lleno de rutas que nadie había visto.', 'Cada pliegue guardaba una pregunta, nunca una frontera.', 'Lía abrió otra hoja. La ciudad aún tenía historias.'] },
];
function illustration(chapter, page, line) {
  const lines = [];
  for (const word of line.split(' ')) {
    if (!lines.length || (lines.at(-1) + ' ' + word).length > 44) lines.push(word);
    else lines[lines.length - 1] += ` ${word}`;
  }
  const caption = lines.map((text, i) => `<tspan x="48" dy="${i ? 42 : 0}">${text}</tspan>`).join('');
  const shift = (Number(chapter) * 37 + page * 59) % 180;
  const towers = Array.from({ length: 10 }, (_, i) => `<rect x="${i * 85 - 20}" y="${760 - (i * 73 + shift) % 260}" width="62" height="${380 + (i * 73 + shift) % 260}" rx="8" fill="${i % 2 ? '#29233e' : '#3d3260'}"/><path d="M${i * 85} 850v28m0 28v28m0 28v28" stroke="#bfa6fa" stroke-width="6"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1400" viewBox="0 0 800 1400"><defs><linearGradient id="sky" x2="0.6" y2="1"><stop stop-color="#171323"/><stop offset=".55" stop-color="#40315e"/><stop offset="1" stop-color="#9380bb"/></linearGradient><radialGradient id="moon"><stop stop-color="#f6e6ff"/><stop offset="1" stop-color="#bc93ee"/></radialGradient></defs><rect width="800" height="1400" fill="#13111c"/><rect x="24" y="24" width="752" height="1060" rx="18" fill="url(#sky)"/><circle cx="${560 - shift}" cy="310" r="125" fill="url(#moon)"/><ellipse cx="405" cy="480" rx="300" ry="105" transform="rotate(-24 405 480)" fill="none" stroke="#d5c2ff" stroke-width="2" stroke-dasharray="8 12"/>${towers}<path d="M110 560 420 360 320 590 290 480Z" fill="#ede2fa"/><path d="m110 560 180-80 130-120-100 230-30-110" fill="none" stroke="#aa8ddb" stroke-width="5"/><path d="M390 1030q-48-80-20-130q-15-65 30-90q50 22 24 88q33 55-4 132" fill="#171323"/><circle cx="400" cy="825" r="27" fill="#171323"/><path d="M420 910q60-55 115-16" fill="none" stroke="#171323" stroke-width="18" stroke-linecap="round"/><rect x="40" y="52" width="280" height="40" rx="20" fill="#171323"/><text x="62" y="79" fill="#e4d5ff" font-family="sans-serif" font-size="16" letter-spacing="2">YITVERSE · ARTE ORIGINAL</text><text x="48" y="1160" fill="#c9b5ed" font-family="sans-serif" font-size="18" letter-spacing="3">ÓRBITA DE PAPEL · CAPÍTULO ${chapter}</text><text x="48" y="1220" fill="#f4edff" font-family="sans-serif" font-size="28">${caption}</text><text x="48" y="1370" fill="#b7a9cb" font-family="sans-serif" font-size="16">DEMOSTRACIÓN FICTICIA · PÁGINA ${page} · SIN MATERIAL DE TERCEROS</text></svg>`;
}
try {
  const { values } = parseArgs({ options: { output: { type: 'string' }, root: { type: 'string' } } });
  const output = await safePath(values.output, { allowMissing: true, outsideGit: true });
  if (await exists(output)) throw Error('Output must be new');
  await privateDirectory(output);
  const proof = path.join(output, 'autorizacion-demo.txt');
  await exclusiveWrite(proof, 'Declaración de demostración: ilustraciones geométricas y textos originales generados por el script de YitVerse. Se autoriza su publicación local para probar este incremento. Sin material de terceros ni datos personales. No acredita derechos de otras obras.');
  for (const story of stories) {
    const input = path.join(output, `chapter-${story.number}`); await privateDirectory(input);
    for (const [i, filename] of ['1.png', '2.png', '10.png'].entries()) {
      const bytes = await sharp(Buffer.from(illustration(story.number, i + 1, story.lines[i]))).png().toBuffer();
      await exclusiveWrite(path.join(input, filename), bytes);
    }
    console.log(JSON.stringify(await importChapter({ root: values.root, input, proof, workId: 'orbita-de-papel', number: story.number, title: story.title, rights: 'own', source: 'Procedural original YitVerse demonstration; generated locally' })));
  }
  console.log('Tres capítulos sintéticos importados. Los saltos 1, 2 y 10 son deliberados para verificar el orden; no representan una serie publicada.');
} catch {
  console.error('No se generó la demostración completa. Usa rutas privadas absolutas fuera de Git, una carpeta de salida nueva y revisa el estado del almacén. No se sobrescriben capítulos.');
  process.exitCode = 1;
}
