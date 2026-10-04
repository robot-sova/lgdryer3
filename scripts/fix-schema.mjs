// One-off schema cleanup (2026-10-04). Run: node scripts/fix-schema.mjs [--dry]
//
// The business is described ONCE, in src/layouts/Layout.astro (@id .../#business). Before
// this, 100+ pages carried their own LocalBusiness: area pages placed the business in every
// city (city-centre geo, different opening hours), credentials were plain strings (schema.org
// validation errors on ~80 pages), and /how-it-works/ claimed a 4.9 rating from 200 reviews
// the site does not have. This script:
//   - turns a standalone page-level LocalBusiness into a Service provided by #business
//     (keeps areaServed / description / serviceType, drops geo, hours, rating, priceRange);
//   - replaces any nested LocalBusiness (provider, worksFor) with a reference to #business;
//   - removes aggregateRating / review anywhere;
//   - City.containedIn → containedInPlace (AdministrativeArea);
//   - moves a JSON-LD block that sits before the layout component inside it.
import fs from 'node:fs';
import path from 'node:path';

const DRY = process.argv.includes('--dry');
const BIZ = { '@id': 'https://lgdryer.repair/#business' };
const ROOT = new URL('../src/pages/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.astro') ? [path.join(d, e.name)] : []);

const isLB = (o) => o && typeof o === 'object' && (o['@type'] === 'LocalBusiness' || (Array.isArray(o['@type']) && o['@type'].includes('LocalBusiness')));

function fixNested(v) {
  if (Array.isArray(v)) return v.map(fixNested);
  if (!v || typeof v !== 'object') return v;
  if (isLB(v)) return { ...BIZ };
  const out = {};
  for (const [k, val] of Object.entries(v)) {
    if (k === 'aggregateRating' || k === 'review') continue;
    if (k === 'containedIn') {
      out.containedInPlace = typeof val === 'string' ? { '@type': 'AdministrativeArea', name: val } : fixNested(val);
      continue;
    }
    out[k] = fixNested(val);
  }
  return out;
}

function fixTop(o) {
  if (!isLB(o)) return fixNested(o);
  const svc = { '@context': o['@context'] || 'https://schema.org', '@type': 'Service' };
  const area = fixNested(o.areaServed);
  const city = area && !Array.isArray(area) && area['@type'] === 'City' ? area.name : null;
  svc.name = city ? `LG Dryer Repair in ${city}` : (o.serviceType || o.name || 'LG Dryer Repair');
  svc.serviceType = o.serviceType || 'LG dryer repair';
  svc.provider = { ...BIZ };
  if (area) svc.areaServed = area;
  if (o.description) svc.description = o.description;
  return svc;
}

const BLOCK = /<script type="application\/ld\+json"(\s+set:html=\{JSON\.stringify\(([\s\S]*?)\)\}\s*\/>|>([\s\S]*?)<\/script>)/g;

let changed = 0, blocks = 0;
const skipped = [];
for (const file of walk(ROOT)) {
  let src = fs.readFileSync(file, 'utf8');
  if (!src.includes('LocalBusiness') && !src.includes('aggregateRating') && !src.includes('containedIn"')) continue;
  const orig = src;
  src = src.replace(BLOCK, (whole, _tail, exprText, rawText) => {
    const text = exprText ?? rawText;
    if (!/LocalBusiness|aggregateRating|"containedIn"/.test(text)) return whole;
    let obj;
    try {
      obj = rawText !== undefined ? JSON.parse(text) : Function(`"use strict"; return (${text});`)();
    } catch (e) {
      skipped.push(`${path.relative(ROOT, file)}: ${e.message}`);
      return whole;
    }
    blocks++;
    const fixed = Array.isArray(obj) ? obj.map(fixTop) : obj['@graph'] ? { ...obj, '@graph': obj['@graph'].map(fixTop) } : fixTop(obj);
    return exprText !== undefined
      ? `<script type="application/ld+json" set:html={JSON.stringify(${JSON.stringify(fixed, null, 4)})} />`
      : `<script type="application/ld+json">\n${JSON.stringify(fixed, null, 2)}\n</script>`;
  });

  // A JSON-LD block placed before the layout component renders before <!doctype html>.
  const m = src.match(/^(---[\s\S]*?---\s*\n)(\s*<script type="application\/ld\+json">[\s\S]*?<\/script>\s*\n)(\s*<([A-Z][A-Za-z]*Layout)\b[\s\S]*)$/);
  if (m) {
    const [, front, script, rest, layout] = m;
    const close = `</${layout}>`;
    const at = rest.lastIndexOf(close);
    if (at > 0) src = front + rest.slice(0, at) + '\n' + script.trim() + '\n' + rest.slice(at);
  }

  if (src !== orig) {
    changed++;
    if (!DRY) fs.writeFileSync(file, src);
  }
}
console.log(`${DRY ? '[dry] ' : ''}files changed: ${changed}, schema blocks rewritten: ${blocks}`);
if (skipped.length) console.log('SKIPPED (not parsed, left as is):\n  ' + skipped.join('\n  '));
