import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const PAGES = 'src/pages';
const PUBLIC = 'public';

// рекурсивно собрать все .astro страницы
function walk(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(p));
    else if (e.name.endsWith('.astro')) out.push(p);
  }
  return out;
}

const pages = walk(PAGES);
const groups = {};

for (const page of pages) {
  const rel = page.replace(/\\/g, '/');
  // тип = первая папка под src/pages
  const m = rel.match(/^src\/pages\/([^/]+)/);
  const type = m ? m[1] : 'root';
  const src = fs.readFileSync(page, 'utf8');

  // вытащить heroImg="..." если есть
  const heroM = src.match(/heroImg\s*=\s*["'`]([^"'`]+)["'`]/);
  const heroPath = heroM ? heroM[1] : null;

  let status = 'NO heroImg prop';
  let dims = '';
  if (heroPath) {
    const fsPath = path.join(PUBLIC, heroPath.replace(/^\//, ''));
    if (fs.existsSync(fsPath)) {
      try {
        const meta = await sharp(fsPath).metadata();
        dims = `${meta.width}x${meta.height} ${meta.format}`;
        status = 'OK';
      } catch { status = 'FILE exists, unreadable'; }
    } else {
      status = 'FILE MISSING';
    }
  }

  groups[type] ??= [];
  groups[type].push({ page: rel, heroPath, status, dims });
}

// отчёт
console.log('=== СВОДКА ПО ТИПАМ ===');
for (const [type, arr] of Object.entries(groups)) {
  const ok = arr.filter(x => x.status === 'OK').length;
  const miss = arr.filter(x => x.status === 'FILE MISSING').length;
  const noprop = arr.filter(x => x.status === 'NO heroImg prop').length;
  console.log(`${type}: всего ${arr.length} | OK ${ok} | файл отсутствует ${miss} | нет prop ${noprop}`);
}

console.log('\n=== ДЕТАЛИ (только проблемные) ===');
for (const [type, arr] of Object.entries(groups)) {
  const bad = arr.filter(x => x.status !== 'OK');
  if (!bad.length) continue;
  console.log(`\n--- ${type} ---`);
  for (const x of bad) console.log(`  [${x.status}] ${x.page}${x.heroPath ? ' -> ' + x.heroPath : ''}`);
}

console.log('\n=== РАЗМЕРЫ СУЩЕСТВУЮЩИХ HERO ===');
for (const [type, arr] of Object.entries(groups)) {
  const ok = arr.filter(x => x.status === 'OK');
  if (!ok.length) continue;
  console.log(`\n--- ${type} ---`);
  for (const x of ok) console.log(`  ${x.dims}  ${x.heroPath}`);
}
