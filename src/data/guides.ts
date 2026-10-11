// Index of the guide pages (repairs, symptoms, prices, washer error codes), built from the page
// sources at build time — so a new guide page appears in its hub and in "Related guides" without
// anyone editing a list. Used by GuideHub.astro (the section hubs) and RelatedGuides.astro.
//
// Title and description are read from the page's own `title="…"` / `description="…"` props.
// The card label is the title up to the first " | " or " — ", without the leading "LG ".

export type Section =
  | 'dryer-repairs' | 'dryer-symptoms' | 'dryer-prices'
  | 'washer-repairs' | 'washer-symptoms' | 'washer-prices' | 'washer-error-codes';

export type Guide = { path: string; section: Section; appliance: 'washer' | 'dryer'; label: string; desc: string; key: string };

const SECTIONS: { section: Section; dir: string }[] = [
  { section: 'dryer-repairs', dir: '/src/pages/repairs/' },
  { section: 'dryer-symptoms', dir: '/src/pages/symptoms/' },
  { section: 'dryer-prices', dir: '/src/pages/price-list/' },
  { section: 'washer-repairs', dir: '/src/pages/washer/repairs/' },
  { section: 'washer-symptoms', dir: '/src/pages/washer/symptoms/' },
  { section: 'washer-prices', dir: '/src/pages/washer/price-list/' },
  { section: 'washer-error-codes', dir: '/src/pages/washer/error-codes/' },
];

export const SECTION_HUB: Record<Section, { href: string; label: string }> = {
  'dryer-repairs': { href: '/repairs/', label: 'Dryer repairs' },
  'dryer-symptoms': { href: '/symptoms/', label: 'Dryer symptoms' },
  'dryer-prices': { href: '/price-list/', label: 'Dryer repair prices' },
  'washer-repairs': { href: '/washer/repairs/', label: 'Washer repairs' },
  'washer-symptoms': { href: '/washer/symptoms/', label: 'Washer symptoms' },
  'washer-prices': { href: '/washer/price-list/', label: 'Washer repair prices' },
  'washer-error-codes': { href: '/washer/error-codes/', label: 'Washer error codes' },
};

const sources = import.meta.glob('/src/pages/**/*.astro', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const prop = (src: string, name: string) => {
  const m = src.match(new RegExp(`\\b${name}="([^"]+)"`)) ?? src.match(new RegExp(`const ${name} = ["'\`]([^"'\`]+)["'\`]`));
  return m ? m[1] : '';
};
const labelOf = (title: string, slug: string) => {
  const t = title.split(/ \| | — | - /)[0].replace(/^LG\s+/, '').trim();
  return t || slug.replace(/^lg-(dryer|washer)-/, '').replace(/-/g, ' ');
};
const firstSentence = (d: string) => {
  const s = d.replace(/\s*(?:Call )?\(323\) 990-7550\.?/g, '').trim();
  const cut = s.search(/[.?!](\s|$)/);
  return (cut > 20 ? s.slice(0, cut + 1) : s).slice(0, 140);
};
/** Shared stem used to pair a repair with its price page: "lg-dryer-belt-replacement" ↔ "…-cost". */
const keyOf = (slug: string) => slug.replace(/-cost$/, '').replace(/^lg-(dryer|washer)-/, '').replace(/-replacement$/, '').replace(/^door-boot-seal$/, 'door-seal');

export const GUIDES: Guide[] = SECTIONS.flatMap(({ section, dir }) =>
  Object.entries(sources)
    .filter(([file]) => file.startsWith(dir) && !file.slice(dir.length).includes('/') && !file.endsWith('/index.astro'))
    .map(([file, src]) => {
      const slug = file.slice(dir.length).replace(/\.astro$/, '');
      const title = prop(src, 'title');
      return {
        path: dir.replace('/src/pages', '') + slug + '/',
        section,
        appliance: section.startsWith('washer') ? 'washer' : 'dryer',
        label: labelOf(title, slug),
        desc: firstSentence(prop(src, 'description')),
        key: keyOf(slug),
      } as Guide;
    })
    .sort((a, b) => a.path.localeCompare(b.path)),
);

export const guidesIn = (section: Section) => GUIDES.filter((g) => g.section === section);
export const guideAt = (path: string) => GUIDES.find((g) => g.path === path);
