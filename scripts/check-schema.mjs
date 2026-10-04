// Checks the built site (dist/): run after `npm run build`.
//   - every JSON-LD block parses;
//   - exactly one LocalBusiness per page (the one in Layout.astro);
//   - no aggregateRating (the site has no reviews to rate);
//   - no "$65" diagnostic left (price is $89 since 2026-10-04; $65–100 and $65-120 are part prices);
//   - meta description not longer than 160 characters.
import fs from 'node:fs';
import path from 'node:path';

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : e.name === 'index.html' ? [path.join(d, e.name)] : []);

let pages = 0;
const fail = { jsonErrors: [], notOneBusiness: [], rating: [], still65: [], longDesc: [] };
for (const f of walk('dist')) {
  pages++;
  const rel = path.relative('dist', f).split(path.sep).join('/');
  const h = fs.readFileSync(f, 'utf8');
  let businesses = 0;
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const s = JSON.stringify(JSON.parse(m[1]));
      businesses += (s.match(/"@type":"LocalBusiness"/g) || []).length;
      if (s.includes('aggregateRating')) fail.rating.push(rel);
    } catch (e) {
      fail.jsonErrors.push(`${rel}: ${e.message}`);
    }
  }
  if (businesses !== 1) fail.notOneBusiness.push(`${rel} (${businesses})`);
  if (/\$65(?![–-]1[02]0)/.test(h)) fail.still65.push(rel);
  const md = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const text = md.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
  if (text.length > 160) fail.longDesc.push(`${text.length} ${rel}`);
}
console.log(`pages: ${pages}`);
let bad = 0;
for (const [k, v] of Object.entries(fail)) {
  console.log(`${k}: ${v.length}`);
  v.slice(0, 12).forEach((x) => console.log(`   ${x}`));
  if (k !== 'longDesc') bad += v.length;
}
process.exit(bad ? 1 : 0);
