import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = '/tmp/washer-w1';
const DEST = 'public/images/washer';
const SUBS = ['error-codes','symptoms','repairs','price-list'];
const WIDTHS = [['', 1920], ['-960', 960], ['-640', 640]];

for (const sub of SUBS) fs.mkdirSync(path.join(DEST, sub), { recursive: true });

const pngs = fs.readdirSync(SRC).filter(f => f.endsWith('.png'));
console.log('PNG найдено:', pngs.length);

let written = 0;
for (const png of pngs) {
  const m = png.match(/^([^_]+(?:-[^_]+)*)__(.+)\.png$/); // {sub}__{slug}.png
  if (!m) { console.log('SKIP (имя):', png); continue; }
  const sub = m[1], slug = m[2];
  const inPath = path.join(SRC, png);
  for (const [suffix, w] of WIDTHS) {
    const baseName = `${slug}-hero${suffix}`;
    const pipeline = () => sharp(inPath)
      .resize({ width: w })          // height auto, без cover — кроп делает CSS
      .modulate({ brightness: 1.08 })
      .gamma(1.05);
    // webp
    await pipeline().webp({ quality: 75 }).toFile(path.join(DEST, sub, `${baseName}.webp`));
    // jpg
    await pipeline().jpeg({ quality: 80 }).toFile(path.join(DEST, sub, `${baseName}.jpg`));
    written += 2;
  }
}
console.log('Файлов записано:', written, '(ожидали', pngs.length * 6 + ')');
