import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = '/tmp/hubs';
const DEST = 'public/images/hubs';
const WIDTHS = [['', 1920], ['-960', 960], ['-640', 640]];

fs.mkdirSync(DEST, { recursive: true });

const pngs = fs.readdirSync(SRC).filter(f => f.endsWith('.png'));
console.log('PNG найдено:', pngs.length);

let written = 0;
for (const png of pngs) {
  const slug = png.replace(/\.png$/, '');
  const inPath = path.join(SRC, png);
  for (const [suffix, w] of WIDTHS) {
    const baseName = `${slug}-hero${suffix}`;
    const pipeline = () => sharp(inPath)
      .resize({ width: w, withoutEnlargement: true }) // height auto, кроп делает CSS; без апскейла
      .modulate({ brightness: 1.08 })
      .gamma(1.05);
    // webp (strip EXIF — sharp по умолчанию не копирует метаданные)
    await pipeline().webp({ quality: 75 }).toFile(path.join(DEST, `${baseName}.webp`));
    // jpg
    await pipeline().jpeg({ quality: 80 }).toFile(path.join(DEST, `${baseName}.jpg`));
    written += 2;
  }
}
console.log('Файлов записано:', written, '(ожидали', pngs.length * 6 + ')');
