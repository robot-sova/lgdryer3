# lgdryer.repair — PROJECT SNAPSHOT
## Generated: 2026-04-14

Local SEO marketing site for an LG dryer repair business in Southern California (LA / Orange / Ventura counties). Static site, Astro 6, deployed via Cloudflare (Wrangler). Site: `https://lgdryer.repair`.

---

## 1. TECH STACK

From `package.json`:
- **Framework:** Astro `^6.0.4` (static output)
- **Node:** `>=22.12.0`
- **Module type:** ESM (`"type": "module"`)
- **Deps:**
  - `@astrojs/sitemap` `^3.7.2` — sitemap generation
  - `sharp` `^0.34.5` — local image conversion (JPG → WebP via one-off scripts)
  - `wrangler` `^4.77.0` — Cloudflare Pages deploy + type generation
- **Scripts:** `dev`, `build`, `preview`, `astro`, `generate-types` (`wrangler types`)
- **No test framework, no linter, no formatter, no TypeScript config beyond Astro defaults.**

---

## 2. SITE STRUCTURE

Astro file-based routing. `trailingSlash: 'always'` — every page lives at a trailing-slash URL.

### Top-level pages (`src/pages/`)
- `index.astro` → `/`
- `about.astro` → `/about/`
- `book.astro` → `/book/`
- `careers.astro` → `/careers/`
- `how-it-works.astro` → `/how-it-works/`
- `property-managers.astro` → `/property-managers/`

### Sections

| Section | URL pattern | # pages | Index |
|---|---|---|---|
| Repairs | `/repairs/<slug>/` | 11 + index | `repairs/index.astro` |
| Symptoms | `/symptoms/<slug>/` | 8 + index | `symptoms/index.astro` |
| Price List | `/price-list/<slug>/` | 16 + index | `price-list/index.astro` |
| Areas | `/areas/<slug>/` | 45 + index | `areas/index.astro` |
| Help | `/help/<slug>/` | 3 + index | `help/index.astro` |
| Washer (stub) | `/washer/...` | 5 indexes only | — |

### `src/pages/repairs/` (11)
- `lg-dryer-belt-replacement.astro`
- `lg-dryer-drum-bearing-replacement.astro`
- `lg-dryer-drum-replacement.astro`
- `lg-dryer-drum-roller-replacement.astro`
- `lg-dryer-gas-valve-replacement.astro`
- `lg-dryer-heating-element-replacement.astro`
- `lg-dryer-idler-pulley-replacement.astro`
- `lg-dryer-igniter-replacement.astro`
- `lg-dryer-motor-replacement.astro`
- `lg-dryer-thermal-fuse-replacement.astro`
- `lg-gas-dryer-repair.astro`

### `src/pages/symptoms/` (8)
- `lg-dryer-door-wont-close.astro`
- `lg-dryer-flow-sense-error.astro`
- `lg-dryer-making-noise.astro`
- `lg-dryer-not-drying.astro`
- `lg-dryer-not-heating.astro`
- `lg-dryer-not-spinning.astro`
- `lg-dryer-not-starting.astro`
- `lg-dryer-overheating.astro`

### `src/pages/price-list/` (16)
- `dryer-and-washer-installation.astro`
- `dryer-cleaning-service-cost.astro`
- `install-dryer-vent-cost.astro`
- `lg-dryer-belt-replacement-cost.astro`
- `lg-dryer-door-lock-replacement-cost.astro`
- `lg-dryer-drum-bearing-replacement-cost.astro`
- `lg-dryer-drum-replacement-cost.astro`
- `lg-dryer-drum-roller-replacement-cost.astro`
- `lg-dryer-gas-valve-replacement-cost.astro`
- `lg-dryer-heating-element-replacement-cost.astro`
- `lg-dryer-idler-pulley-replacement-cost.astro`
- `lg-dryer-igniter-replacement-cost.astro`
- `lg-dryer-maintenance-cost.astro`
- `lg-dryer-motor-replacement-cost.astro`
- `lg-dryer-repair-cost.astro`
- `lg-dryer-thermal-fuse-replacement-cost.astro`

### `src/pages/areas/` (45)
All slugs follow `lg-dryer-repair-<city>`. Grouped by county in the navbar:
- **LA County (21):** agoura-hills (note: listed in Ventura nav list actually), bel-air, beverly-hills, brentwood, burbank, calabasas, culver-city, glendale, long-beach, los-angeles, malibu, manhattan-beach, marina-del-rey, pacific-palisades, pasadena, playa-del-rey, santa-monica, sherman-oaks, studio-city, torrance, west-hollywood, woodland-hills
- **Orange County (16):** anaheim, costa-mesa, dana-point, fullerton, huntington-beach, irvine, ladera-ranch, laguna-beach, laguna-niguel, lake-forest, mission-viejo, newport-beach, orange-ca, rancho-santa-margarita, tustin, yorba-linda
- **Ventura County (9):** agoura-hills, camarillo, moorpark, newbury-park, oxnard, simi-valley, thousand-oaks, ventura, westlake-village

### `src/pages/help/`
- `index.astro`, `lg-dryer-fire-hazard.astro`, `lg-dryer-parts.astro`, `lg-dryer-tips.astro`

### `src/pages/washer/` — stub section
Only `index.astro` files in `/washer/`, `/washer/repairs/`, `/washer/symptoms/`, `/washer/areas/`, `/washer/error-codes/`. **Excluded from sitemap** via `astro.config.mjs` filter.

---

## 3. LAYOUT SYSTEM

Six layouts in `src/layouts/`. `Layout.astro` is the root shell; the others wrap it to enforce a consistent content template per section.

### `Layout.astro` (root)
Wraps all pages. Emits `<head>`, navbar, mobile menu, `<main>`, footer, global LocalBusiness + WebSite JSON-LD.
```ts
interface Props {
  title?: string;         // default: "LG Dryer Repair Los Angeles | Same Day Service"
  description?: string;   // default: professional dryer repair blurb
  heroImg?: string;       // when set, emits <link rel="preload" as="image" fetchpriority="high">
  ogImage?: string;       // defaults to /images/lg-dryer-hero.webp; absolutized to full URL
}
```
Named slots: `breadcrumbs` (rendered inside the sticky `.site-header`), default slot (rendered inside `<main>`).

Key facts hardcoded in root layout:
- Phone: `(323) 990-7550` / `tel:3239907550`
- Email: `info@lgdryer.repair`
- Address: `155 N Lake Ave #800, Pasadena, CA 91101`
- License: CSLB #1138898, BHGS #49573
- Hours: Mon–Sat 08:00–20:00, Sun closed
- Canonical: `https://lgdryer.repair${Astro.url.pathname}`
- Inline LocalBusiness + WebSite JSON-LD in `<head>`

The arrays `repairLinks`, `symptomLinks`, `priceLinks`, `laCounty`, `orangeCounty`, `venturaCounty` live **inside `Layout.astro`** and drive both the desktop navbar dropdowns and the mobile overlay. Any new repair/symptom/area must be added to these arrays to appear in nav.

### `RepairLayout.astro`
Wraps `Layout`. Template: breadcrumbs → optional `<h1>` → hero image → 2-column body+sidebar → optional before/after photo grid → Service Areas strip → Service + HowTo JSON-LD → `<HowItWorks>`.
```ts
interface Props {
  title: string;
  description: string;
  h1?: string;
  heroImg?: string;
  heroAlt?: string;
  heroCaption?: string;
  partPhoto?: string;
  partPhotoAlt?: string;
  partPhotoCaption?: string;
  partPhotoLabel?: string;
  beforeAfterPhotos?: Array<{src: string, alt: string, caption: string}>;
  cost?: string;            // display string, e.g. "$300–380"
  price_min?: number;       // default 149 — used in Offer JSON-LD
  price_max?: number;       // default 399
}
```
Named slots: `before-part-photo` (pre-partPhoto content), default (main body). Sidebar is fully layout-owned — pages can't customize it.

### `SymptomLayout.astro`
```ts
interface Props {
  title: string;
  description: string;
  symptoms?: string[];                // chip labels
  activeSymptoms?: string[];          // which chips get .active styling
  symptomPhotos?: Array<{src, alt, caption}>;  // 3-col grid
  symptomPhotosCaption?: string;
  relatedParts?: Array<{name, photo, cost, slug}>; // sidebar list
  repairCost?: string;
}
```
Named slots: `before-photos`, default. Renders `<AIDiagnosticCTA>` at end of body, then `<HowItWorks>`.

### `PriceLayout.astro`
Template: breadcrumbs → price hero banner (label, title, `$min–$max`, diagnostic note) → optional hero img → 2-col with Cost-breakdown cards (Part, Labor, Total) + sidebar ("Get Exact Quote" CTA, "Repair vs New Dryer" compare box, Other Repairs, Included checklist).
```ts
interface Props {
  title: string;
  description: string;
  serviceName?: string;   // displayed as H1 inside banner
  priceMin: string;       // displayed and cast to Number for JSON-LD
  priceMax: string;
  partCost?: string;
  laborCost?: string;
  includes?: string;
  newDryerCost?: string;  // default "$800–1,500"
  savings?: string;
  heroImg?: string;
  heroAlt?: string;
  heroCaption?: string;
  otherRepairs?: Array<{name, price, slug}>;
}
```
Named slots: `intro` (above cost-breakdown), default (below cost-breakdown, above sidebar siblings).

### `AreaLayout.astro`
Template: breadcrumbs → city hero img → 2-col with (H1 "LG Dryer Repair in <city>, <state>" → ZIP chips → trust badges → intro slot → area img → neighborhoods grid → default slot → callback form → testimonial) + sidebar (CTA with city-specific title + callback-form anchor + nearby-cities list + credentials). Then `<HowItWorks>`, then OSM embed map, then LocalBusiness JSON-LD with `areaServed: <city>, CA`.
```ts
interface Props {
  title: string;
  description: string;
  city: string;
  state?: string;             // default 'CA'
  county?: string;
  zipCodes?: string[];
  heroImg?: string;
  heroCaption?: string;
  areaImg?: string;
  areaImgCaption?: string;
  neighborhoods?: string[];
  featuredNeighborhoods?: string[];
  nearbyCities?: string[];    // mapped to /areas/lg-dryer-repair-<slug>/ via internal cityToSlug dict
  testimonial?: { text, author, stars? };
  responseTime?: string;      // default '2–4 hours'
}
```
Named slots: `intro` (above area photo), default.

Contains a **callback form** that POSTs to `/api/contact` with `{name, phone, message, email}`. ⚠️ The site is `output: 'static'` — there is no `/api/contact` endpoint in the repo. This form currently fails silently unless Cloudflare Pages Functions/Workers handle it externally.

### `RepairLayoutV2.astro`
Present in `src/layouts/` but unverified in this pass — appears unused by the listed repair pages (they all use `RepairLayout`). Treat as experimental / to-be-pruned.

---

## 4. DESIGN TOKENS

No CSS custom properties / `:root` variables. Colors are hardcoded throughout. Effective palette:

| Token | Value | Use |
|---|---|---|
| Background primary | `#0a0a0a` | body |
| Background card | `#111` / `#111111` | nav dropdowns, cards, footer |
| Background deep | `#0d1a2e`, `#0a1520` | AI-diag gradient |
| Border subtle | `rgba(255,255,255,0.06)` / `#1e2a3a` | card/footer borders |
| Text primary | `#ffffff` | headings |
| Text body | `#c8d0dc` | paragraph copy |
| Text muted | `#8a9ab0`, `rgba(255,255,255,0.55)` | captions, footer |
| Text hint | `#4a5a6a` | form placeholders, timestamps |
| Accent (LG blue) | `#1a6cf6` | primary CTA, links-on-hover, price range |
| Accent hover | `#1558d6` / `#1558d0` | btn hover |
| Success | `#4ade80` | form success |
| Font | `system-ui, sans-serif` | everything |
| Container | `max-width: 1100px`, `width: 90%` | `.container` |
| Article max-width | `860px` | `.maintext` |
| Border radius | `6–14px` | buttons, cards |

Key reusable classes in `global.css`: `.container`, `.glass`, `.btn` / `.btn-primary` / `.btn-secondary` / `.btn-lg`, `.badge` / `.badge-blue`, `.hero`, `.page-hero`, `.section`, `.two-col`, `.symptom-chip`, `.maintext` (article body), `.article-layout` / `.article-body` / `.article-sidebar`, `.sidebar-cta` / `.sidebar-box` / `.sidebar-checklist`, `.price-card`, `.trust-badges`, `.callback-form-*`, `.hw-*` (HowItWorks).

Navbar is sticky at `.site-header` with `backdrop-filter: blur(20px)`.

---

## 5. NAVIGATION

Navbar structure (defined as arrays in `Layout.astro`):

**Repair ▾** — 10 repair pages + divider + secondary links (How it works, Property managers, Parts diagram)
```
Heating Element, Thermal Fuse, Drum Roller, Igniter, Motor,
Drum Bearing, Belt, Idler Pulley, Gas Valve, Drum Replacement
```

**Symptoms ▾** — 8 symptom pages
```
Not Heating, Not Spinning, Not Starting, Making Noise, Not Drying,
Door Won't Close, Flow Sense Error, Overheating
```

**Price List ▾** — 16 pages, 2-column grid, each row shows label + price range
```
LG Dryer Repair Cost $150–480, Heating Element $300–380,
Thermal Fuse $280–350, Drum Rollers $280–350, Belt $260–320,
Drum Bearing $320–400, Idler Pulley $200–260, Motor $380–480,
Drum Replacement $380–480, Gas Valve $280–450, Igniter (Gas) $280–350,
Door Lock $150–220, Annual Maintenance $150–250, Vent Cleaning $150–200,
Vent Installation $149–450, Washer & Dryer Install $150–300
```

**Areas ▾** — 600px-wide mega menu, 3 county sections, 4-col city grid per county
- LA County (21 cities listed)
- Orange County (16)
- Ventura County (9)

**About** (plain link) · **(323) 990-7550** (CTA button, `tel:`)

**Mobile menu** (`.mobile-overlay`, toggled by `.hamburger` below 900px): Repair Services (all 10), Symptoms (all 8), Price List (all 16), Service Areas (4 LA + 2 OC only), Help (Parts Diagram, Fire Hazard & Prevention), CTA phone button.

JS for mobile menu inline at bottom of `Layout.astro` — listens for click/close/overlay-click/link-click to toggle `.active`.

---

## 6. PAGE-BY-PAGE INVENTORY

Titles inferred from layout prop patterns; spot-checked against `lg-dryer-heating-element-replacement.astro`:

### Repairs (all use `RepairLayout`)
- `lg-dryer-heating-element-replacement` — "LG Dryer Heating Element Replacement Los Angeles | Same Day", H1 "LG Dryer Heating Element Replacement in Los Angeles", part #5301EL1001J, $300–380
- Other 10 repair pages follow the same template: `title`, `h1`, `heroImg`, `partPhoto`, `cost`, `price_min/max`, long-form body text with embedded `<figure class="article-img">` images, internal cross-links to `/repairs/...` and `/price-list/...`.

### Symptoms (all use `SymptomLayout`)
- Each sets `symptoms[]` chips, `symptomPhotos[]` (3-col grid), `relatedParts[]` (sidebar), `repairCost`. Body is conversational troubleshooting copy followed by `<AIDiagnosticCTA>` auto-appended by layout.

### Price List (all use `PriceLayout`)
- Each sets `serviceName`, `priceMin`, `priceMax`, `partCost`, `laborCost`, `includes`, `newDryerCost`, `savings`, hero image, `otherRepairs[]`. Body via `intro` and default slots around the auto-rendered Cost-breakdown cards.

### Areas (all use `AreaLayout`)
- Each sets `city`, `county`, `zipCodes[]`, `heroImg`, `neighborhoods[]`, optional `testimonial`, `nearbyCities[]`, `responseTime`. Each has its own city-hero image in `public/images/areas/lg-dryer-repair-<slug>-hero.webp`.

### Standalone
- `index.astro` — home; two hero tabs (Callback / Booking) + popular repairs list + all sections linked
- `book.astro` — long booking form (name/phone/email/address/model/date/time)
- `about.astro` — owner bio + founder photo at `/images/about/roman-lg-dryer-repair-los-angeles.webp`
- `careers.astro`, `how-it-works.astro`, `property-managers.astro` — narrative marketing pages
- `help/index.astro`, `help/lg-dryer-fire-hazard.astro`, `help/lg-dryer-parts.astro`, `help/lg-dryer-tips.astro`

---

## 7. COMPONENTS (`src/components/`)

### `Breadcrumbs.astro`
```ts
interface Props { items: Array<{ label: string; href?: string }> }
```
Emits `<nav class="breadcrumbs">` with Schema.org `BreadcrumbList` microdata. Auto-prepends a "Home" root item. Used via the `breadcrumbs` named slot in all four section layouts.

### `AIDiagnosticCTA.astro`
Zero props. Renders a blue-gradient CTA block ("FREE AI DIAGNOSIS — Not sure what's wrong with your LG dryer?") linking to `/` (the home page has the actual AI form). Used in `RepairLayout` sidebar (via `.sidebar-ai-diag` override that re-styles it compact) and at the end of `SymptomLayout` body.

### `HowItWorks.astro`
Zero props. 6-card grid (Book a visit → Technician arrives → Diagnosis $65 → You approve → Repair completed → Payment after demo) with step numbers, SVG icons, tags, and a "See the full process explained →" link to `/how-it-works/`. Appears at the bottom of `RepairLayout`, `SymptomLayout`, `PriceLayout`, `AreaLayout`.

---

## 8. CONTENT PATTERNS

### Repair page frontmatter
```astro
<RepairLayout
  title="..." description="..." h1="..."
  heroImg="/images/repairs/<part>-hero.webp"
  heroAlt="..." heroCaption="..."
  partPhoto="/images/repairs/<part>-part.webp"
  partPhotoLabel="OEM PART · <partNumber>"
  cost="$X–Y" price_min={X} price_max={Y}
>
  <p>Body copy...</p>
  <h2>Subhead</h2>
  <figure class="article-img"><img ...><figcaption>...</figcaption></figure>
</RepairLayout>
```

### Symptom page
```astro
<SymptomLayout
  title="..." description="..."
  symptoms={['chip1','chip2',...]}
  activeSymptoms={['chip1']}
  symptomPhotos={[{src,alt,caption},...]}
  relatedParts={[{name,photo,cost,slug},...]}
  repairCost="$X–Y"
>
  <p>Troubleshooting body...</p>
</SymptomLayout>
```

### Price page
```astro
<PriceLayout
  serviceName="..." priceMin="300" priceMax="380"
  partCost="$80–120" laborCost="$220–260"
  newDryerCost="$900–1500" savings="$500+"
  otherRepairs={[{name,price,slug},...]}
>
  <div slot="intro">Why this repair matters...</div>
  <div>Full body after cost breakdown cards...</div>
</PriceLayout>
```

### Area page
```astro
<AreaLayout
  city="Beverly Hills" county="Los Angeles"
  zipCodes={['90210','90211','90212']}
  heroImg="/images/areas/lg-dryer-repair-beverly-hills-hero.webp"
  neighborhoods={[...]} featuredNeighborhoods={[...]}
  nearbyCities={['Santa Monica','West Hollywood',...]}
  testimonial={{text,author,stars:5}}
  responseTime="2–4 hours"
>
  <div slot="intro">City-specific lede...</div>
  <div>Long-tail local content...</div>
</AreaLayout>
```

---

## 9. SCHEMA MARKUP

Hardcoded JSON-LD per layout:

| Layout | Schema types emitted |
|---|---|
| `Layout` (site-wide) | `LocalBusiness` (full NAP, geo, license, hours) + `WebSite` |
| `Breadcrumbs` | `BreadcrumbList` (microdata, not JSON-LD) |
| `RepairLayout` | `Service` with `Offer` + `PriceSpecification` (uses `price_min/max` props) + `HowTo` with 4 steps |
| `SymptomLayout` | `Service` (simpler — no offer) |
| `PriceLayout` | `Service` + `Offer` + `PriceSpecification` (uses `priceMin/priceMax` props, `availability: InStock`) |
| `AreaLayout` | `LocalBusiness` scoped to the city (`areaServed: <city>, CA`) |

---

## 10. BUILD & DEPLOY

### `astro.config.mjs`
```js
export default defineConfig({
  site: 'https://lgdryer.repair',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/washer/') })],
});
```
- Static SSG output (no SSR adapter).
- `/washer/*` excluded from `sitemap-index.xml`.
- Trailing-slash policy enforced at routing + canonical levels.

### Commands
- `npm run dev` — local dev server
- `npm run build` — produces `./dist/`
- `npm run preview` — preview built site
- `npm run generate-types` — `wrangler types` (Cloudflare types)

### Cloudflare Pages
Deployment config is not in-repo (no `wrangler.toml` found in this pass). `wrangler` dependency suggests Cloudflare Pages or Workers hosting. Redirects are managed via `public/_redirects` (Cloudflare-compatible):
```
/areas/lg-dryer-repair-orange/ → /areas/lg-dryer-repair-orange-ca/ 301
/services/lg-dryer-repair/ → /repairs/lg-dryer-heating-element-replacement/ 301
/services/lg-appliance-reapir/ → / 301
/price-list/lg-dryer-drum-roller-replacement-guide/ → /price-list/lg-dryer-drum-roller-replacement-cost/ 301
/price-list/lg-dryer-vent-cleaning/ → /price-list/dryer-cleaning-service-cost/ 301
```

### Public assets
- `public/favicon.svg`, `public/favicon.ico`
- `public/robots.txt`
- `public/scripts/` — 5 idle-animation JS files (`dryer-idle-animation.js` through `-v5.js`), likely legacy; verify before removing

---

## 11. IMAGES

Folder structure under `public/images/`:
- `about/` — 1 file (`roman-lg-dryer-repair-los-angeles.webp`)
- `areas/` — 45 city hero WebPs (`lg-dryer-repair-<slug>-hero.webp`) + `neighborhood/` subfolder
- `price-list/` — 16 hero WebPs (`<slug>-hero-new.webp`). `lg-dryer-repair-cost-hero-new.jpg` + `.webp` coexist (just regenerated).
- `repairs/` — ~85 files. Each repair has hero + part + before/after + context photos. Multiple version suffixes (`-v2`, `-v3`, `-new`) suggest iterative reshoots; not all versions are necessarily referenced.
- `symptoms/` — hero + diagnostic photos per symptom, all `-new` suffix
- `washer/` — (stub; unverified content)
- `_archive/` — `areas/`, `repairs/`, `washer/` — old images kept but not served
- `test/` — test images
- Root: `lg-dryer-hero.webp` (homepage + default OG), one Nano-Banana variation file

**Note:** `.webp` is the standard. `public/images/price-list/lg-dryer-repair-cost-hero-new.jpg` was added in the most recent commit alongside its `.webp` — the `.jpg` is the source, the `.webp` the served file.

---

## 12. KNOWN ISSUES & TODOs

### Grep for TODO/FIXME/placeholder matched 7 files
- `src/pages/index.astro`
- `src/pages/book.astro`
- `src/pages/about.astro`
- `src/pages/careers.astro`
- `src/pages/property-managers.astro`
- `src/layouts/AreaLayout.astro`
- `src/styles/global.css`

Most hits are form placeholder attrs (`placeholder="..."`) rather than real TODOs; audit individually before acting.

### Structural gaps to flag
1. **`/api/contact` endpoint is referenced but not implemented.** `AreaLayout.astro` callback form POSTs to `/api/contact`; homepage and `book.astro` likely do too. Site is `output: 'static'`, so this only works if Cloudflare Pages Functions provides it externally. Currently **submissions fail silently** — confirm and either add a Pages Function or wire to a third-party form handler.
2. **`RepairLayoutV2.astro` is unused** in the audited pages. Either delete or document purpose.
3. **5 versions of `dryer-idle-animation*.js`** in `public/scripts/` — only one (if any) is loaded. Prune.
4. **Nav arrays duplicate source-of-truth.** Every new repair/symptom/price/area page requires manual edits to arrays in `Layout.astro`. Consider collections or a shared config file.
5. **Nav "Agoura Hills" is in Ventura County list but geographically LA County.** Confirm intent.
6. **Nav Areas mega-menu shows 21 LA cities but the folder has 22 LA-area slugs** (e.g. `los-angeles` is listed; cross-check for any city that has a page but not a nav entry).
7. **Mobile nav Areas is trimmed to 6 cities** (4 LA + 2 OC) — the remaining 39 cities are only findable via desktop nav, `/areas/` index, or organic search.
8. **Image version sprawl in `repairs/`** (`-v2`, `-v3`, `-new`, `-new2`, `-new3`). Identify unreferenced variants and move to `_archive/`.
9. **No sitemap filter for `/test/` or archived images** — assets aren't in the sitemap anyway (only pages), but test images are publicly reachable.
10. **Hardcoded phone/address across many files.** If business details change, every layout + JSON-LD block needs editing. Consider a single `src/data/business.ts`.
11. **No robots.txt contents audited** this pass — verify it doesn't block `/washer/` if that's intentionally hidden.

### Washer section
`/washer/*` has only 5 `index.astro` files and is excluded from the sitemap. It's a placeholder/parking area, not a live section.
