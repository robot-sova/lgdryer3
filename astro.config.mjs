// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, existsSync } from 'node:fs';

// <lastmod> per page from src/data/lastmod.json — written by scripts/gen-lastmod.mjs from the
// built page's visible content, so a date moves only when the page really changed.
const LASTMOD_FILE = new URL('./src/data/lastmod.json', import.meta.url);
/** @type {Record<string, { lastmod: string }>} */
const lastmod = existsSync(LASTMOD_FILE) ? JSON.parse(readFileSync(LASTMOD_FILE, 'utf8')) : {};

export default defineConfig({
  site: 'https://lgdryer.repair',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      serialize(item) {
        const entry = lastmod[new URL(item.url).pathname];
        if (entry) item.lastmod = entry.lastmod;
        return item;
      },
    }),
  ],
});
