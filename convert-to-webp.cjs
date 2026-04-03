const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = './public/images';

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) return walk(full);
    if (!/\.(jpg|jpeg)$/i.test(f)) return;
    const out = full.replace(/\.(jpg|jpeg)$/i, '.webp');
    sharp(full).webp({ quality: 85 }).toFile(out, (err) => {
      if (err) console.error('Error:', full, err.message);
      else console.log('✓', out);
    });
  });
}

walk(imgDir);
