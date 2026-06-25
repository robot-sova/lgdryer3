import fs from 'node:fs'; import path from 'node:path';
const KEY = fs.readFileSync('secrets/gemini-key.txt','utf8').trim();
const MODEL='gemini-2.5-flash-image';
const OUT='/tmp/hubs'; fs.mkdirSync(OUT,{recursive:true});

const COMMON = ' Wide 21:9 photorealistic documentary photo, natural realistic lighting, NOT AI-glossy, NOT staged. CENTERED composition, subject fully in frame with margins, whole scene sharp — NO blur, NO dark panel, NO vignette. Clean bright residential setting, even daylight. No text overlays. 2K.';
const VAN = 'Friendly professional appliance repair technician standing next to a plain white Ford Transit van, navy blue polo shirt, holding a tool bag, big confident smile, full body visible.' + COMMON;

const HUBS = [
  { slug:'washer-index',        out:'public/images/hubs/washer-index-hero',        prompt:'One modern LG front-load washing machine in a clean laundry room, overview shot.'+COMMON },
  { slug:'washer-errorcodes',   out:'public/images/hubs/washer-errorcodes-hero',   prompt:'Close-up of an LG front-load washer control panel, digital display glowing softly (blank, no characters).'+COMMON },
  { slug:'washer-repairs',      out:'public/images/hubs/washer-repairs-hero',      prompt:'LG front-load washer with front panel removed, stainless drum visible, open tool bag on the floor.'+COMMON },
  { slug:'washer-symptoms',     out:'public/images/hubs/washer-symptoms-hero',     prompt:'LG front-load washer with door open, neutral diagnostic scene in a tidy laundry room.'+COMMON },
  { slug:'washer-areas',        out:'public/images/hubs/washer-areas-hero',        prompt:VAN+' Background: a Los Angeles residential street, sunny day.' },
  { slug:'areas-index',         out:'public/images/hubs/areas-index-hero',         prompt:VAN+' Background: a Southern California residential neighborhood, sunny day.' },
  { slug:'pricelist-index',     out:'public/images/hubs/pricelist-index-hero',     prompt:'One modern LG dryer in a laundry room with a printed paper estimate and a small spare part in the foreground.'+COMMON },
  { slug:'symptoms-index',      out:'public/images/hubs/symptoms-index-hero',      prompt:'One modern LG dryer in a clean laundry room, neutral diagnostic overview scene.'+COMMON },
  { slug:'repairs-index',       out:'public/images/hubs/repairs-index-hero',       prompt:'LG dryer pulled out with rear/lower panel off, components visible, open tool bag on the floor.'+COMMON },
  { slug:'about',               out:'public/images/hubs/about-hero',               prompt:VAN+' Background: a clean residential driveway, sunny California day, welcoming brand feel.' },
  { slug:'help',                out:'public/images/hubs/help-hero',                prompt:'A modern LG washer and LG dryer side by side in a bright clean laundry room, overview shot.'+COMMON },
];

async function gen(prompt,outPng,tries=0){
  try{
    const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseModalities:['IMAGE'],imageConfig:{aspectRatio:'21:9'}}})});
    if(r.status===429){if(tries<5){await new Promise(s=>setTimeout(s,15000));return gen(prompt,outPng,tries+1);}throw new Error('429');}
    if(!r.ok)throw new Error('HTTP '+r.status+' '+(await r.text()).slice(0,150));
    const j=await r.json(); const p=j.candidates?.[0]?.content?.parts?.find(x=>x.inlineData);
    if(!p)throw new Error('no image'); fs.writeFileSync(outPng,Buffer.from(p.inlineData.data,'base64'));
    const b=fs.readFileSync(outPng); if(!(b[0]===0x89&&b[1]===0x50))throw new Error('not PNG'); return true;
  }catch(e){if(tries<3){await new Promise(s=>setTimeout(s,8000));return gen(prompt,outPng,tries+1);}throw e;}
}

let ok=0,fail=[];
for(const h of HUBS){
  const png=path.join(OUT,h.slug+'.png');
  process.stdout.write('gen '+h.slug+' ... ');
  try{await gen(h.prompt,png);ok++;console.log('ok');}catch(e){fail.push(h.slug+': '+e.message);console.log('FAIL',e.message);}
  await new Promise(s=>setTimeout(s,4000));
}
console.log('\nИТОГ ok',ok,'/',HUBS.length); if(fail.length)fail.forEach(f=>console.log('  '+f));
fs.writeFileSync(OUT+'/_hubs.json', JSON.stringify(HUBS.map(h=>({slug:h.slug,out:h.out})),null,2));
