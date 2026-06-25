import fs from 'node:fs';
import path from 'node:path';

const KEY = fs.readFileSync('secrets/gemini-key.txt','utf8').trim();
const MODEL = 'gemini-2.5-flash-image';
const OUT = '/tmp/washer-w1';
fs.mkdirSync(OUT, { recursive: true });

// 31 washer content-страница (без index). Собираем из src/pages/washer/.
function collectSlugs() {
  const base = 'src/pages/washer';
  const subs = ['error-codes','symptoms','repairs','price-list'];
  const list = [];
  for (const sub of subs) {
    const dir = path.join(base, sub);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.astro') || f === 'index.astro') continue;
      list.push({ sub, slug: f.replace('.astro',''), file: path.join(dir,f) });
    }
  }
  return list;
}

const STYLE = 'Wide 21:9 photorealistic documentary photo, natural realistic lighting, NOT AI-glossy, NOT staged. ONE single modern LG front-load washing machine, stainless/white, CENTERED in the frame, the entire unit fully visible with comfortable margins on all sides. Whole scene sharp and in focus — NO blur, NO dark panel, NO vignette. Clean residential laundry room, bright airy daylight, evenly lit across the full width. No people, no second unit, no text overlays. 2K.';

// repairs-прогон: логотип LG на корпусе разрешён (текстовых оверлеев всё равно нет)
const STYLE_REPAIRS = 'Wide 21:9 photorealistic documentary photo, natural realistic lighting, NOT AI-glossy, NOT staged. ONE single modern LG front-load washing machine, stainless/white, CENTERED in the frame, fully visible with margins on all sides. Whole scene sharp — NO blur, NO dark panel, NO vignette. Clean residential laundry room, bright daylight evenly across the width. No people, no second unit. 2K.';

const TPL = {
  'error-codes': 'Close-up three-quarter view of the LG front-load washer control panel area, the digital display glowing softly (blank, NO characters). '+STYLE,
  'symptoms':    'LG front-load washer with its door open, a few damp clothes visible inside, a small puddle of water on the tiled floor in front suggesting a problem. '+STYLE,
  'repairs':     'LG front-load washer with the entire front service panel and door boot removed, the stainless steel inner drum and suspension clearly visible and in sharp focus, an open tool bag with wrenches and a multimeter on the floor beside it, mid-repair scene. '+STYLE_REPAIRS,
  'price-list':  'LG front-load washer in a tidy laundry room with a printed paper estimate and a small spare part placed on top of the machine in the foreground. '+STYLE,
};

async function genOne(prompt, outPath, tries=0) {
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ contents:[{parts:[{text:prompt}]}], generationConfig:{ responseModalities:['IMAGE'], imageConfig:{ aspectRatio:'21:9' } } })
    });
    if (r.status===429) { if(tries<5){await new Promise(s=>setTimeout(s,15000));return genOne(prompt,outPath,tries+1);} throw new Error('429 after retries'); }
    if (!r.ok) throw new Error('HTTP '+r.status+' '+(await r.text()).slice(0,200));
    const j = await r.json();
    const part = j.candidates?.[0]?.content?.parts?.find(p=>p.inlineData);
    if (!part) throw new Error('no image in response');
    fs.writeFileSync(outPath, Buffer.from(part.inlineData.data,'base64'));
    const b = fs.readFileSync(outPath);
    if (!(b[0]===0x89&&b[1]===0x50&&b[2]===0x4E&&b[3]===0x47)) throw new Error('not a PNG');
    return true;
  } catch(e){ if(tries<3){await new Promise(s=>setTimeout(s,8000));return genOne(prompt,outPath,tries+1);} throw e; }
}

const ONLY = process.argv[2]; // напр. "repairs"
const items0 = collectSlugs();
const items = ONLY ? items0.filter(x=>x.sub===ONLY) : items0;
console.log('Найдено washer-страниц:', items.length, ONLY ? `(только ${ONLY})` : '');
let ok=0, fail=[];
for (const it of items) {
  const prompt = TPL[it.sub] + ` Subject context: ${it.slug.replace(/-/g,' ')}.`;
  const out = path.join(OUT, `${it.sub}__${it.slug}.png`);
  process.stdout.write(`gen ${it.sub}/${it.slug} ... `);
  try { await genOne(prompt, out); ok++; console.log('ok'); }
  catch(e){ fail.push(it.sub+'/'+it.slug+': '+e.message); console.log('FAIL', e.message); }
  await new Promise(s=>setTimeout(s, 4000)); // rate-limit пауза
}
console.log('\nИТОГ: ok',ok,'/ всего',items.length);
if (fail.length) { console.log('FAILED:'); fail.forEach(f=>console.log('  '+f)); }
