import fs from 'node:fs';
import path from 'node:path';

const BASE = 'src/pages/washer';
const SUBS = ['error-codes','symptoms','repairs','price-list'];

function humanAlt(slug) {
  // убираем ведущий "lg-washer-", остальное → слова
  const rest = slug.replace(/^lg-washer-/, '').replace(/-/g, ' ').trim();
  return `LG washer ${rest} Los Angeles`;
}

const changed = [];
let skipped = 0;

for (const sub of SUBS) {
  const dir = path.join(BASE, sub);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.astro') || f === 'index.astro') continue;
    const file = path.join(dir, f);
    const slug = f.replace('.astro', '');
    let c = fs.readFileSync(file, 'utf8');

    if (/heroImg\s*=/.test(c)) { skipped++; continue; }              // идемпотентность
    if (!/<SymptomLayout\b/.test(c)) { skipped++; continue; }         // не тот layout

    const heroImg = `/images/washer/${sub}/${slug}-hero.webp`;
    const heroAlt = humanAlt(slug);
    const inject = `<SymptomLayout\n  heroImg="${heroImg}"\n  heroAlt="${heroAlt}"\n`;
    const c2 = c.replace(/<SymptomLayout\r?\n/, inject);
    if (c2 === c) { skipped++; console.log('NO-MATCH:', file); continue; }

    fs.writeFileSync(file, c2);
    changed.push(`${sub}/${slug}  -> ${heroImg}`);
  }
}

console.log('Изменено страниц:', changed.length);
changed.forEach(x => console.log('  ' + x));
console.log('Пропущено:', skipped);
