#!/usr/bin/env node
/**
 * gen-brand-photos.mjs — hero photos for brand pages (/samsung-washer-repair/ etc.) with Gemini.
 *
 * Same API call and retry rules as scooter-repair-site/scripts/gen-photos.mjs. Prompts live in
 * scripts/brand-photo-prompts.json. No logos or readable text on the machines: we are an
 * independent service, a brand mark on the hero would read as an official affiliation.
 *
 *   node scripts/gen-brand-photos.mjs --out <dir> [--only id,id] [--n 2]
 *
 * Key: secrets/gemini-key.txt here, else ../scooter-repair-site/secrets/gemini-key.txt. Never printed.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const keyFile = [resolve(ROOT, 'secrets/gemini-key.txt'), resolve(ROOT, '../scooter-repair-site/secrets/gemini-key.txt')].find(existsSync);
if (!keyFile) throw new Error('no secrets/gemini-key.txt');
const key = readFileSync(keyFile, 'utf8').trim();
const map = JSON.parse(readFileSync(resolve(ROOT, 'scripts/brand-photo-prompts.json'), 'utf8'));

const argv = process.argv.slice(2);
const opt = (n) => (argv.includes(`--${n}`) ? argv[argv.indexOf(`--${n}`) + 1] : undefined);
const OUT = resolve(opt('out') ?? resolve(ROOT, 'gen'));
const ONLY = opt('only') ? new Set(opt('only').split(',')) : null;
const N = Number(opt('n') ?? 2);
mkdirSync(OUT, { recursive: true });

const MODEL = 'gemini-3-pro-image';
const RETRY_STATUSES = new Set([429, 500, 503]);
const MAX_ATTEMPTS = 4;
const MAX_PARALLEL = 4;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function generate(prompt, outPath) {
  const body = {
    contents: [{ parts: [{ text: `${map._common}\n\n${prompt}` }] }],
    generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: map._aspect ?? '21:9' } },
  };
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let why = '';
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (RETRY_STATUSES.has(res.status)) why = `HTTP ${res.status}`;
      else if (!res.ok) return { ok: false, why: `HTTP ${res.status} ${(await res.text()).slice(0, 200)}` };
      else {
        const j = await res.json();
        const cand = j.candidates?.[0];
        const img = (cand?.content?.parts ?? []).find((p) => p.inlineData?.data);
        if (!img) why = `no image (finishReason ${cand?.finishReason ?? 'none'})`;
        else {
          writeFileSync(outPath, Buffer.from(img.inlineData.data, 'base64'));
          return { ok: true };
        }
      }
    } catch (err) {
      why = `network: ${err.message}`;
    }
    if (attempt < MAX_ATTEMPTS) await sleep(1500 * attempt);
    else return { ok: false, why };
  }
}

const jobs = [];
for (const [id, prompt] of Object.entries(map)) {
  if (id.startsWith('_') || (ONLY && !ONLY.has(id))) continue;
  for (let c = 1; c <= N; c++) jobs.push({ id, prompt, out: resolve(OUT, `${id}-c${c}.png`) });
}
console.log(`${jobs.length} images, model ${MODEL}`);
let i = 0;
let failed = 0;
await Promise.all(
  Array.from({ length: MAX_PARALLEL }, async () => {
    while (i < jobs.length) {
      const j = jobs[i++];
      const r = await generate(j.prompt, j.out);
      if (r.ok) console.log(`ok ${j.id}-c${j.out.slice(-5, -4)}`);
      else { failed++; console.log(`FAIL ${j.id}: ${r.why}`); }
    }
  }),
);
console.log(`done, ${failed} failed`);
process.exit(failed ? 1 : 0);
