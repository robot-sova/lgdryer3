import fs from 'node:fs';
const KEY=fs.readFileSync('secrets/gemini-key.txt','utf8').trim();
const MODEL='gemini-2.5-flash-image';
const prompt='Wide 21:9 photorealistic documentary photo, natural realistic lighting, NOT AI-glossy, NOT staged. EXACTLY ONE single modern LG front-load washing machine, stainless/white, CENTERED, fully in frame with margins. ABSOLUTELY NO second appliance, no other unit anywhere in the frame, only one machine. Door slightly open with a few damp clothes, a small puddle of water on the tiled floor in front. Whole scene sharp — NO blur, NO dark panel. Clean residential laundry room, bright even daylight. No people, no text, no logos overlay. 2K.';
const out='/tmp/leaking.png';
const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseModalities:['IMAGE'],imageConfig:{aspectRatio:'21:9'}}})});
if(!r.ok){console.log('HTTP',r.status,(await r.text()).slice(0,200));process.exit(1);}
const j=await r.json();const p=j.candidates?.[0]?.content?.parts?.find(x=>x.inlineData);
if(!p){console.log('no image');process.exit(1);}
fs.writeFileSync(out,Buffer.from(p.inlineData.data,'base64'));
console.log('saved',out);
