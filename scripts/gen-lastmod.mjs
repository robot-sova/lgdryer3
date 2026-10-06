#!/usr/bin/env node
/**
 * scripts/gen-lastmod.mjs — honest <lastmod> for the sitemap (same scheme as socalcoffee.repair).
 *
 *   node scripts/gen-lastmod.mjs          # after a build: update src/data/lastmod.json, rebuild if dates moved
 *   node scripts/gen-lastmod.mjs --check  # exit 1 if the committed file is behind dist/
 *   node scripts/gen-lastmod.mjs --seed   # first run only: date unknown pages from git history
 *
 * WHY NOT "TODAY" AND WHY NOT GIT ON EVERY BUILD. Google trusts <lastmod> only while it proves
 * reliable; stamping every URL with the build date teaches it to ignore the field. Cloudflare Pages
 * also builds from a shallow clone, where every file's "last commit" is the deploy itself.
 *
 * So the date follows what the reader sees. For each sitemap URL the script hashes the built page's
 * title, meta description, image files and the visible text of <main>. Header, mobile menu and footer
 * are outside <main> on purpose: a menu edit must not re-date all 133 pages. The date moves only
 * when the hash moves.
 *
 * The file is COMMITTED: Cloudflare only runs `npm run build`, and astro.config.mjs reads the dates
 * from it. Workflow before a push: `npm run build && npm run lastmod` (rebuilds by itself when dates
 * moved), then commit src/data/lastmod.json with the change.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const DIST = 'dist';
const OUT = 'src/data/lastmod.json';
const SITE = 'https://lgdryer.repair';
const CHECK = process.argv.includes('--check');
const SEED = process.argv.includes('--seed');

/** Today in Los Angeles — the business's day, not the build machine's. */
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(new Date());

const dec = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#38;/g, '&').replace(/&nbsp;/g, ' ');
function fingerprint(html) {
  const title = (html.match(/<title>([^<]*)<\/title>/) ?? [, ''])[1];
  const meta = (html.match(/<meta name="description" content="([^"]*)"/) ?? [, ''])[1];
  const main = (html.match(/<main[\s\S]*?<\/main>/) ?? [html])[0]
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ');
  const imgs = [...new Set([...main.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]))].sort();
  const text = dec(main.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
  return createHash('sha1').update([title, meta, imgs.join(','), text].join(' | ')).digest('hex').slice(0, 16);
}

/** URL path → the page's own source file. */
function sourceOf(path) {
  const base = `src/pages${path.replace(/\/$/, '')}`;
  for (const f of [`${base}.astro`, `${base}/index.astro`, path === '/' ? 'src/pages/index.astro' : '']) {
    if (f && existsSync(f)) return f;
  }
  return null;
}

/** First run: the last commit that touched the page's own file or the layout it renders through. */
function seedDate(path) {
  const src = sourceOf(path);
  if (!src) return today;
  const files = [src];
  const layout = readFileSync(src, 'utf8').match(/import\s+\w+\s+from\s+['"][./]*layouts\/(\w+Layout)\.astro['"]/);
  // Layout.astro is the shared chrome (header/footer) and is not part of the fingerprint either.
  if (layout && layout[1] !== 'Layout') files.push(`src/layouts/${layout[1]}.astro`);
  const dates = files
    .map((f) => { try { return execSync(`git log -1 --format=%cs -- "${f}"`, { encoding: 'utf8' }).trim(); } catch { return ''; } })
    .filter(Boolean)
    .sort();
  return dates.at(-1) ?? today;
}

const SITEMAP = join(DIST, 'sitemap-0.xml');
if (!existsSync(SITEMAP)) { console.error('gen-lastmod: run `npm run build` first'); process.exit(2); }
const paths = [...readFileSync(SITEMAP, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, ''));
const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};
const next = {};
const moved = [];

for (const p of paths.sort()) {
  const file = join(DIST, p, 'index.html');
  if (!existsSync(file)) { console.error(`gen-lastmod: ${p} is in the sitemap but was not built`); process.exit(2); }
  const hash = fingerprint(readFileSync(file, 'utf8'));
  const was = prev[p];
  if (!was) { next[p] = { hash, lastmod: SEED ? seedDate(p) : today }; moved.push(`${p} (new)`); }
  else if (was.hash !== hash) { next[p] = { hash, lastmod: today }; moved.push(p); }
  else next[p] = was;
}
const dropped = Object.keys(prev).filter((p) => !(p in next));

if (CHECK) {
  if (moved.length || dropped.length) {
    console.log(`lastmod: ${moved.length} page(s) changed since ${OUT} was written — run \`npm run lastmod\`:`);
    for (const m of moved.slice(0, 12)) console.log('  ' + m);
    process.exit(1);
  }
  console.log(`lastmod: ${paths.length} page(s), committed dates match the build: PASS`);
  process.exit(0);
}

writeFileSync(OUT, JSON.stringify(next, null, 2) + '\n');
console.log(`lastmod: ${paths.length} page(s), ${moved.length} re-dated${dropped.length ? `, ${dropped.length} dropped` : ''}`);
// The sitemap is written during the build from the file just changed — when a date moved, build once more.
if (moved.length || dropped.length) {
  console.log('lastmod: dates moved — rebuilding so the sitemap carries them');
  execSync('npm run build', { stdio: 'inherit' });
}
