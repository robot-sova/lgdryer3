/**
 * LG Dryer Hero — Idle Animation v5
 */
(function () {
  'use strict';

  const isMobile = () => window.innerWidth < 768;

  const IDLE_MS   = 3000;
  const PHASE2_MS = 3000;

  const IMG_W = 720;
  const IMG_H = 1071;

  // Табло: сдвинуто влево −8% и вниз +8%
  const DISP_X = 291;
  const DISP_Y = 127;
  const DISP_W = 138;
  const DISP_H = 30;

  // Кнопка — правее дисплея, по центру высоты
  const PWR_X = DISP_X + DISP_W + 20;
  const PWR_Y = DISP_Y + DISP_H / 2;
  const PWR_R = 13;

  // Барабан — сдвинут вниз на полрадиуса (+98)
  const DOOR_X = 360;
  const DOOR_Y = 486;
  const DOOR_R = 195;

  // Крутилка
  const KNOB_X = 360;
  const KNOB_Y = 189;
  const KNOB_R = 22;

  let canvas, ctx;
  let idleTimer  = null;
  let p2Timer    = null;
  let p3Timer    = null;
  let animFrame  = null;
  let blinkTimer = null;
  let countTimer = null;

  let phase      = 0;
  let blinkOn    = true;
  let blinkCount = 0;
  let totalSecs  = 1800;
  let drumAngle  = 0;
  let lastTs     = 0;

  function init() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    canvas = document.createElement('canvas');
    canvas.id = 'dryerIdleCanvas';
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;';
    const heroBg = hero.querySelector('.hero-bg');
    heroBg ? heroBg.after(canvas) : hero.prepend(canvas);
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    // Анимация сбрасывается ТОЛЬКО при клике на интерактивный элемент
    // или при уходе со страницы — НЕ при скролле и движении мыши
    document.addEventListener('click', (e) => {
      const target = e.target;
      const isInteractive = target.closest('a, button, input, select, textarea, [role="button"]');
      if (isInteractive) resetIdleTimer();
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) resetIdleTimer();
    });

    // На мобиле — запускаем сразу через 5 секунд без условий
    // На десктопе — оставляем старую логику (сброс при любом движении)
    if (!isMobile()) {
      ['mousemove','mousedown','keydown','scroll','touchstart'].forEach(ev => {
        document.addEventListener(ev, onActivity, { passive: true });
      });
    }
    resetIdleTimer();
  }

  function resizeCanvas() {
    if (!canvas) return;
    const p = canvas.closest('.hero') || canvas.parentElement;
    canvas.width  = p.offsetWidth;
    canvas.height = p.offsetHeight;
  }

  function map() {
    const cW = canvas.width;
    const cH = canvas.height;
    const ia = IMG_W / IMG_H;
    const ca = cW / cH;
    let scale, ox, oy;
    if (ca > ia) {
      scale = cW / IMG_W;
      ox = 0;
      oy = -((IMG_H * scale - cH) * 0.15);
    } else {
      scale = cH / IMG_H;
      ox = (cW - IMG_W * scale) / 2;
      oy = 0;
    }
    return {
      dispX: DISP_X * scale + ox,
      dispY: DISP_Y * scale + oy,
      dispW: DISP_W * scale,
      dispH: DISP_H * scale,
      pwrX:  PWR_X  * scale + ox,
      pwrY:  PWR_Y  * scale + oy,
      pwrR:  PWR_R  * scale,
      knobX: KNOB_X * scale + ox,
      knobY: KNOB_Y * scale + oy,
      knobR: KNOB_R * scale,
      doorX: DOOR_X * scale + ox,
      doorY: DOOR_Y * scale + oy,
      doorR: DOOR_R * scale,
      scale,
    };
  }

  function fmt(s) {
    return String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');
  }

  // ── Кнопка ⏻ — правильный символ power ──────────────────────────────────
  // Символ состоит из:
  // 1. Окружность с разрывом вверху (примерно 300° дуга)
  // 2. Вертикальная линия сверху через разрыв
  function drawPowerBtn(m) {
    const { pwrX: x, pwrY: y, pwrR: r, scale } = m;

    ctx.save();

    // Корпус кнопки
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#0f0f0f';
    ctx.strokeStyle = '#1a6cf6';
    ctx.lineWidth = 1.8 * scale;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Символ ⏻ внутри
    const sr = r * 0.48; // радиус символа
    ctx.strokeStyle = '#5ab4ff';
    ctx.lineWidth   = 1.6 * scale;
    ctx.lineCap     = 'round';

    // Дуга 300° — разрыв вверху 60° (от -210° до 30° в радианах)
    // то есть от (-210°= -7π/6) до (30°= π/6)
    const gapHalf = Math.PI / 6; // 30° в каждую сторону от верха
    ctx.beginPath();
    ctx.arc(x, y, sr,
      -Math.PI / 2 + gapHalf,   // начало: 30° от верха по часовой
      -Math.PI / 2 - gapHalf,   // конец:  30° от верха против часовой
      false
    );
    ctx.stroke();

    // Вертикальная линия — из центра вверх, через разрыв, чуть выше дуги
    ctx.beginPath();
    ctx.moveTo(x, y + sr * 0.15);   // немного ниже центра
    ctx.lineTo(x, y - sr * 1.25);   // выше дуги
    ctx.stroke();

    // Зелёная точка — индикатор включения (правый верх кнопки)
    ctx.fillStyle = '#00e838';
    ctx.shadowColor = '#00e838';
    ctx.shadowBlur = 4 * scale;
    ctx.beginPath();
    ctx.arc(x + r * 0.60, y - r * 0.60, r * 0.19, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ── Огоньки вокруг крутилки ───────────────────────────────────────────────
  function drawKnob(m) {
    const { knobX: x, knobY: y, scale } = m;
    const orbit  = 28 * scale;
    const dotR   = 2.8 * scale;
    const count  = 12;
    const now    = Date.now();

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const px = x + Math.cos(angle) * orbit;
      const py = y + Math.sin(angle) * orbit;
      const wave  = Math.sin(now / 180 - i * (Math.PI * 2 / count));
      const alpha = 0.2 + Math.max(0, wave) * 0.8;

      ctx.save();
      ctx.globalAlpha = alpha * 0.3;
      ctx.fillStyle = '#1a6cf6';
      ctx.beginPath();
      ctx.arc(px, py, dotR * 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#5ab4ff';
      ctx.beginPath();
      ctx.arc(px, py, dotR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ── Огни вокруг крутилки ─────────────────────────────────────────────────
  function drawKnob(m) {
    const { knobX: x, knobY: y, knobR: r, scale } = m;
    const count  = 12;
    const orbit  = r + 11 * scale;
    const dotR   = 2.8 * scale;
    const now    = Date.now();

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const dx    = x + Math.cos(angle) * orbit;
      const dy    = y + Math.sin(angle) * orbit;
      const wave  = Math.sin(now / 180 - i * (Math.PI * 2 / count));
      const alpha = 0.25 + Math.max(0, wave) * 0.75;

      ctx.save();
      ctx.globalAlpha = alpha * 0.3;
      const grd = ctx.createRadialGradient(dx, dy, 0, dx, dy, dotR * 3);
      grd.addColorStop(0,   'rgba(26,108,246,0.9)');
      grd.addColorStop(1,   'rgba(26,108,246,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(dx, dy, dotR * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#5aabff';
      ctx.beginPath();
      ctx.arc(dx, dy, dotR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ── 7-сегментный рендер цифр ─────────────────────────────────────────────
  // Сегменты: [top, top-right, bot-right, bottom, bot-left, top-left, middle]
  const SEG7 = {
    '0': [1,1,1,1,1,1,0],
    '1': [0,1,1,0,0,0,0],
    '2': [1,1,0,1,1,0,1],
    '3': [1,1,1,1,0,0,1],
    '4': [0,1,1,0,0,1,1],
    '5': [1,0,1,1,0,1,1],
    '6': [1,0,1,1,1,1,1],
    '7': [1,1,1,0,0,0,0],
    '8': [1,1,1,1,1,1,1],
    '9': [1,1,1,1,0,1,1],
    ':': null,
  };

  function drawSegDigit(cx, cy, w, h, ch, alpha, color) {
    if (ch === ':') {
      // Двоеточие — две точки
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      const dr = w * 0.18;
      ctx.beginPath();
      ctx.arc(cx, cy - h * 0.18, dr, 0, Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy + h * 0.18, dr, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
      return;
    }
    const segs = SEG7[ch];
    if (!segs) return;

    const t  = w * 0.12;  // толщина сегмента
    const g  = w * 0.04;  // зазор
    const hw = w / 2 - g;
    const hh = h / 2 - g;

    // Координаты 7 сегментов: [top, top-right, bot-right, bottom, bot-left, top-left, middle]
    const segments = [
      // top: горизонталь вверху
      [[cx-hw+t, cy-hh], [cx+hw-t, cy-hh], [cx+hw-t*0.5, cy-hh+t], [cx-hw+t*0.5, cy-hh+t]],
      // top-right: вертикаль справа вверху
      [[cx+hw-t, cy-hh+t], [cx+hw, cy-hh+t*0.5], [cx+hw, cy-g], [cx+hw-t, cy-g]],
      // bot-right: вертикаль справа внизу
      [[cx+hw-t, cy+g], [cx+hw, cy+g], [cx+hw, cy+hh-t*0.5], [cx+hw-t, cy+hh-t]],
      // bottom: горизонталь внизу
      [[cx-hw+t*0.5, cy+hh-t], [cx+hw-t*0.5, cy+hh-t], [cx+hw-t, cy+hh], [cx-hw+t, cy+hh]],
      // bot-left: вертикаль слева внизу
      [[cx-hw, cy+g], [cx-hw+t, cy+g], [cx-hw+t, cy+hh-t], [cx-hw, cy+hh-t*0.5]],
      // top-left: вертикаль слева вверху
      [[cx-hw, cy-hh+t*0.5], [cx-hw+t, cy-hh+t], [cx-hw+t, cy-g], [cx-hw, cy-g]],
      // middle: горизонталь посередине
      [[cx-hw+t*0.5, cy-t*0.5], [cx+hw-t*0.5, cy-t*0.5], [cx+hw-t, cy+t*0.5], [cx-hw+t, cy+t*0.5]],
    ];

    ctx.save();
    segments.forEach((pts, i) => {
      ctx.globalAlpha = segs[i] ? alpha : alpha * 0.07;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      pts.forEach(p => ctx.lineTo(p[0], p[1]));
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();
  }

  function drawTimeSegments(str, cx, cy, charW, charH, alpha, color) {
    const chars = str.split('');
    const colonW = charW * 0.45;
    // Считаем полную ширину
    let totalW = 0;
    chars.forEach(c => { totalW += c === ':' ? colonW : charW; });
    totalW += (chars.length - 1) * charW * 0.12; // межсимвольный зазор

    let x = cx - totalW / 2;
    chars.forEach(c => {
      const cw = c === ':' ? colonW : charW;
      drawSegDigit(x + cw/2, cy, cw, charH, c, alpha, color);
      x += cw + charW * 0.12;
    });
  }
  let dryBlink = true;
  let dryBlinkTimer = null;

  function drawDisplay(m) {
    const { dispX, dispY, dispW, dispH, scale } = m;

    ctx.save();

    ctx.globalAlpha = 0.92;
    ctx.fillStyle = '#020a1a';
    ctx.beginPath();
    ctx.roundRect(dispX, dispY, dispW, dispH, 3 * scale);
    ctx.fill();

    const alpha = (phase === 2) ? (blinkOn ? 1 : 0.04) : 1;

    // Цифры — 7-сегментный стиль
    const charW = dispH * 0.48;
    const charH = dispH * 0.52;
    drawTimeSegments(fmt(totalSecs), dispX + dispW * 0.58, dispY + dispH / 2, charW, charH, alpha, '#4ae8ff');

    // DRY — слева от цифр, мигает независимо
    ctx.globalAlpha = dryBlink ? 0.9 : 0.08;
    ctx.fillStyle = '#4ae8ff';
    ctx.font = `bold ${Math.round(14 * scale)}px "Courier New", monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('DRY', dispX + dispW * 0.04, dispY + dispH / 2);

    ctx.restore();
  }

  // ── Барабан ──────────────────────────────────────────────────────────────
  const ITEMS = [
    { d:0.37, a:0,            rw:0.145, rh:0.056, c:[70,110,200]  },
    { d:0.29, a:Math.PI*0.7,  rw:0.125, rh:0.048, c:[200,65,65]   },
    { d:0.41, a:Math.PI*1.3,  rw:0.135, rh:0.052, c:[65,170,85]   },
    { d:0.23, a:Math.PI*2.0,  rw:0.105, rh:0.040, c:[200,165,55]  },
    { d:0.43, a:Math.PI*0.4,  rw:0.095, rh:0.036, c:[150,65,200]  },
    { d:0.19, a:Math.PI*1.7,  rw:0.115, rh:0.043, c:[200,120,55]  },
  ];

  function drawDrum(m) {
    const { doorX:cx, doorY:cy, doorR:R, scale } = m;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI*2);
    ctx.clip();

    // Тёплое свечение
    const g = ctx.createRadialGradient(cx, cy-R*0.08, 0, cx, cy, R);
    g.addColorStop(0,   'rgba(255,205,90,0.22)');
    g.addColorStop(0.5, 'rgba(255,140,40,0.10)');
    g.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(cx-R, cy-R, R*2, R*2);

    // Белье
    ITEMS.forEach(item => {
      const a  = item.a + drumAngle;
      const ix = cx + Math.cos(a) * (R * item.d);
      const iy = cy + Math.sin(a) * (R * item.d * 0.52);
      ctx.save();
      ctx.translate(ix, iy);
      ctx.rotate(a + Math.PI * 0.3);
      const rw = R * item.rw;
      const rh = R * item.rh;
      const [r,gv,b] = item.c;
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = `rgba(${r},${gv},${b},0.88)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, rw, rh, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath();
      ctx.ellipse(-rw*0.2, -rh*0.25, rw*0.40, rh*0.30, -0.3, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    });

    ctx.restore();

    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI*2);
    ctx.stroke();
    ctx.restore();
  }

  // ── Советы ───────────────────────────────────────────────────────────────
  const TIPS = [
    { side: 'left',  text: "After every drying cycle, clean the lint filter. This keeps the unit running efficiently and extends its lifespan." },
    { side: 'right', text: "Never overload the drum — fill it no more than halfway. Always check garment labels for load recommendations." },
    { side: 'left',  text: "Check that the exhaust duct behind the unit is not kinked or crushed. Proper airflow prevents overheating." },
    { side: 'right', text: "Before loading, always check pockets for coins, gum, or paper. Foreign objects cause noise, odors, and damage." },
    { side: 'left',  text: "At least once a year, have the unit professionally serviced — interior cleaned and lint removed. Lint buildup is a leading cause of dryer fires." },
    { side: 'right', text: "Make sure the leveling legs are properly adjusted so the unit doesn't rock or vibrate during operation." },
    { side: 'left',  text: "Clean the full length of your exhaust duct at least once a year — especially if the duct run exceeds 9 feet." },
    { side: 'right', text: "If you hear grinding, squealing, or unusual vibration — stop using the dryer immediately to avoid further damage and a more costly repair." },
    { side: 'left',  text: "Never service or disassemble the unit without unplugging it from the power outlet first." },
    { side: 'right', text: "Use delicate or low-heat settings for cotton and linen fabrics to prevent shrinkage and fiber damage." },
    { side: 'left',  text: "Never dry footwear inside the drum — it can damage both the shoes and the drum itself." },
    { side: 'right', text: "If you smell burning, stop the dryer immediately, unplug it, and call a technician to inspect it for fire hazards." },
    { side: 'right', text: "Before starting the dryer, always check inside the drum for pets. Cats and small animals may climb in while the door is open and you're away." },
    { side: 'left',  text: "Once a month, wash the lint filter with water to remove fabric softener and dryer sheet residue. Let it dry completely before reinserting — residue buildup restricts airflow even when the filter looks clean." },
    { side: 'right', text: "Wipe the moisture sensor inside the drum with a dry cloth regularly. Fabric softener residue coats the sensor and causes inaccurate drying times or the dryer shutting off too early." },
    { side: 'left',  text: "Inspect the door gasket for tears, lint buildup, or debris. A damaged seal allows heat to escape, reducing efficiency and potentially causing the drum interior to overheat." },
    { side: 'right', text: "Every 6 months, lubricate the drum rollers, idler pulley, and bearings with manufacturer-approved lubricant. This prevents squealing, reduces motor strain, and extends the life of internal components." },
    { side: 'left',  text: "Sort your laundry before drying — mix heavy and light items together so they tumble freely. Drying only heavy items like towels or jeans together extends cycle time and increases wear on the motor and belt." },
    { side: 'right', text: "Trust LG Dryer Repair for same-day service by experienced technicians at fair market prices. We diagnose and fix your dryer the same day you call. (323) 990-7550" },
    { side: 'left',  text: "Use your washer's highest spin speed before transferring clothes to the dryer. The more water spun out in the washer, the less energy and time needed to dry — this one habit can cut drying time significantly." },
    { side: 'right', text: "Always use the Auto Dry / moisture sensor cycle instead of a timed cycle. It automatically stops when clothes are dry, preventing over-drying which damages fabrics and wastes energy." },
    { side: 'left',  text: "Dry two or more loads back to back. The drum is already hot from the first cycle — starting the next load immediately takes advantage of that residual heat and reduces energy use." },
    { side: 'right', text: "Try wool dryer balls instead of dryer sheets. They separate clothes, improve airflow, reduce static, and cut drying time — and unlike dryer sheets, they don't leave residue on the moisture sensor." },
    { side: 'left',  text: "Before putting wet laundry in the dryer, shake and untangle each item. Tangled clothes trap moisture and dry unevenly, causing the dryer to run longer than necessary." },
    { side: 'right', text: "Use low heat when you're not in a rush. Modern LG dryers dry most loads on low heat just as effectively as high heat — it takes slightly longer but uses less energy and is gentler on fabrics." },
    { side: 'left',  text: "Use the cool-down cycle if your dryer has one. It finishes drying clothes using the heat already inside the drum — no extra energy needed for the final minutes of the cycle." },
    { side: 'right', text: "Never run the dryer when you leave home or go to sleep. If a fire starts while no one is present, the damage can be catastrophic. Always run the dryer only when someone is home and awake." },
    { side: 'left',  text: "If your exhaust duct is plastic or foil accordion-style, replace it with rigid metal ducting. Plastic ducts sag, trap lint at low points, and are a leading cause of dryer fires. Rigid metal is the only safe option." },
    { side: 'right', text: "Never dry clothes soaked in gasoline, cooking oil, paint thinner, or other flammable chemicals — even after washing. The residue can ignite in the dryer. Hang these items outside to air dry first." },
    { side: 'left',  text: "Keep at least 36 inches of clear space around the dryer. Never store boxes, cleaning supplies, or clothing near it. Lint is highly flammable and any nearby combustibles become a serious fire risk." },
    { side: 'right', text: "Never dry wool sweaters, cashmere, or silk in the dryer. Heat causes wool fibers to contract permanently — often shrinking garments to unwearable sizes. Lay them flat on a rack to air dry instead." },
    { side: 'left',  text: "Don't dry activewear and sportswear on high heat. The elastic fibers that give workout clothes their stretch are slowly destroyed by heat. A few cycles later, your favorite gear will feel permanently loose." },
    { side: 'right', text: "Never put bath mats with rubber backing in the dryer. The rubber can melt, fall apart, and create a serious fire hazard inside the drum. Hang them in a sunny spot to air dry instead." },
    { side: 'left',  text: "Don't dry clothes with sequins, beads, or metal embellishments — the dryer can dislodge or melt them, damage the drum interior, and snag other garments in the load. Always air dry embellished items flat." },
    { side: 'right', text: "Check the outdoor vent flap every few months. It should open freely when the dryer runs and close when it stops. A stuck or blocked flap traps hot air and lint inside — a fire hazard and efficiency killer." },
    { side: 'left',  text: "Forgot clothes in the dryer and they came out wrinkled? Toss in 2–3 ice cubes and run on high heat for 5 minutes. The steam from melting ice releases wrinkles — no iron needed." },
    { side: 'right', text: "Remove clothes from the dryer immediately when the cycle ends and fold or hang them right away while still warm. Leaving clothes in a warm drum for even 15 minutes sets in wrinkles that are hard to shake out later." },
    { side: 'left',  text: "Add a clean, dry towel to a wet load to absorb extra moisture. This simple trick can cut drying time by up to 20 minutes — remove the towel after the first 15–20 minutes and continue the cycle." },
    { side: 'right', text: "Put all your socks in a mesh laundry bag before washing and drying. They stay paired through the entire cycle — no more searching for missing socks at the bottom of the drum." },
    { side: 'left',  text: "Over-drying is the number one cause of static cling. Always use the Auto Dry / sensor cycle so the dryer stops exactly when clothes are dry — not a minute longer." },
    { side: 'right', text: "Crumple a ball of aluminum foil and toss it in the dryer with your load. It neutralizes static electricity buildup on synthetic fabrics — a free, chemical-free alternative to dryer sheets that lasts for months." },
    { side: 'left',  text: "Dry bulky items like towels, comforters, and sheets in a separate load from lightweight clothing. Heavy and light items have very different drying times — mixing them leads to over-drying the light items while heavy ones stay damp." },
    { side: 'right', text: "If your LG dryer has a Steam Fresh cycle, use it to refresh lightly worn clothes — dress shirts, blazers, trousers — without a full wash. It removes odors and reduces wrinkles in just 20–30 minutes." },
    { side: 'left',  text: "Never use the steam cycle on wool, silk, nylon, lace, or easily shrinkable fabrics. Steam heat can permanently damage these materials. Steam works best on cotton, cotton-polyester blends, and common knits." },
    { side: 'right', text: "The steam cycle is designed for dry clothes only — not freshly washed wet items. Load no more than 3–5 garments at a time for best results. Overloading prevents steam from circulating and the cycle won't work properly." },
    { side: 'left',  text: "Fill the steam reservoir with regular tap water — not distilled or reverse osmosis water. Distilled water lacks the minerals the water level sensor needs to work. Use filtered tap water for best performance." },
    { side: 'right', text: "Clean the steam reservoir after every few uses to prevent mineral buildup. Calcium deposits can clog the steam nozzle and reduce steam output. A mild vinegar rinse keeps the system working properly." },
    { side: 'left',  text: "Don't use dryer sheets during a steam cycle — fabric softener residue can cause temporary staining on clothes when combined with steam. Remove any dryer sheets from the drum before selecting a steam cycle." },
    { side: 'right', text: "If you see water dripping inside the drum or leaking from the bottom during a steam cycle — stop the dryer immediately. This usually means the water inlet valve, steam generator, or drain hose needs inspection. Call a technician — do not continue running the unit." },
    { side: 'left',  text: "If water is leaking from where the steam supply hose connects to the wall faucet — turn off the water supply immediately. Disconnect and reconnect the hose firmly, check for cracks, and replace rubber washers at both ends if needed." },
    { side: 'right', text: "The steam generator in LG dryers also sprays a small amount of steam during the last 15 minutes of regular dry cycles to reduce static. If you notice your clothes are slightly damp at the end of a normal cycle, this is normal — not a malfunction." },
  ];

  const TIP_SHOW_MS  = 6000;   // показываем 6 секунд
  const TIP_FADE_MS  = 600;    // плавное появление/исчезновение

  let tipIndex      = 0;
  let tipTimer      = null;
  let tipOpacity    = 0;       // 0..1
  let tipFadeIn     = false;
  let tipFadeOut    = false;
  let tipVisible    = false;
  let tipFadeTimer  = null;

  function startTips() {
    tipIndex   = 0;
    showNextTip();
  }

  function showNextTip() {
    tipOpacity = 0;
    tipFadeIn  = true;
    tipFadeOut = false;
    tipVisible = true;

    // Плавное появление
    const fadeStep = 1000 / 60 / TIP_FADE_MS;
    tipFadeTimer = setInterval(() => {
      tipOpacity = Math.min(1, tipOpacity + fadeStep);
      if (tipOpacity >= 1) {
        clearInterval(tipFadeTimer);
        tipFadeIn = false;
        // Держим 6 секунд потом fade out
        tipTimer = setTimeout(() => {
          tipFadeOut = true;
          tipFadeTimer = setInterval(() => {
            tipOpacity = Math.max(0, tipOpacity - fadeStep);
            if (tipOpacity <= 0) {
              clearInterval(tipFadeTimer);
              tipFadeOut = false;
              tipVisible = false;
              tipIndex = (tipIndex + 1) % TIPS.length;
              // Пауза 0.5с между советами
              tipTimer = setTimeout(() => {
                if (phase >= 3) showNextTip();
              }, 500);
            }
          }, 1000 / 60);
        }, TIP_SHOW_MS);
      }
    }, 1000 / 60);
  }

  function stopTips() {
    clearTimeout(tipTimer);
    clearInterval(tipFadeTimer);
    tipVisible   = false;
    tipOpacity   = 0;
    tipFadeIn    = false;
    tipFadeOut   = false;
    tipTimer     = null;
    tipFadeTimer = null;
  }

  function drawTip(m) {
    if (!tipVisible || tipOpacity <= 0) return;
    const tip = TIPS[tipIndex];

    const cW = canvas.width;
    const cH = canvas.height;

    // Размер окошка — высота увеличена на 30%
    const boxW = cW * 0.18;
    const boxH = cH * 0.208;
    const pad  = cW * 0.018;

    // Симметрично относительно центра, на уровне табло
    const centerY = cH * 0.13;
    const gap = cW * 0.16; // одинаковое расстояние от центра для обеих
    let boxX;
    if (tip.side === 'left') {
      boxX = cW * 0.5 - gap - boxW;
    } else {
      boxX = cW * 0.5 + gap;
    }
    const boxY = centerY - boxH / 2;

    ctx.save();
    ctx.globalAlpha = tipOpacity;

    // Glassmorphism фон
    ctx.fillStyle = 'rgba(10, 20, 40, 0.72)';
    ctx.strokeStyle = 'rgba(100, 160, 255, 0.25)';
    ctx.lineWidth = 1;
    const r = 10;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, r);
    ctx.fill();
    ctx.stroke();

    // Тонкая синяя полоска сверху
    ctx.fillStyle = 'rgba(26, 108, 246, 0.7)';
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, 2.5, [r, r, 0, 0]);
    ctx.fill();

    ctx.fillStyle = '#4ae8ff';
    ctx.font = `bold ${Math.round(cW * 0.014)}px system-ui, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`💡 Tip #${tipIndex + 1}`, boxX + pad, boxY + pad * 0.7);

    // Текст совета с переносом
    ctx.fillStyle = 'rgba(200, 220, 255, 0.92)';
    ctx.font = `${Math.round(cW * 0.011)}px system-ui, sans-serif`;
    ctx.textBaseline = 'top';

    const words    = tip.text.split(' ');
    const maxWidth = boxW - pad * 2;
    const lineH    = cW * 0.014;
    let line       = '';
    let lineY      = boxY + pad * 2.0;

    words.forEach(word => {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, boxX + pad, lineY);
        line  = word;
        lineY += lineH;
      } else {
        line = test;
      }
    });
    if (line) ctx.fillText(line, boxX + pad, lineY);

    ctx.restore();
  }
  function drawMobileTip() {
    if (!tipVisible || tipOpacity <= 0) return;
    const tip = TIPS[tipIndex];
    const cW = canvas.width;
    const cH = canvas.height;

    const boxW = cW * 0.82;
    const boxH = cH * 0.22;
    const boxX = (cW - boxW) / 2;
    const boxY = cH * 0.12;
    const pad  = cW * 0.05;
    const r    = 14;

    ctx.save();
    ctx.globalAlpha = tipOpacity;

    // Glassmorphism фон
    ctx.fillStyle = 'rgba(10, 20, 40, 0.82)';
    ctx.strokeStyle = 'rgba(100, 160, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, r);
    ctx.fill();
    ctx.stroke();

    // Синяя полоска сверху
    ctx.fillStyle = 'rgba(26, 108, 246, 0.8)';
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, 3, [r, r, 0, 0]);
    ctx.fill();

    // Номер совета
    ctx.fillStyle = '#4ae8ff';
    ctx.font = `600 ${Math.round(cW * 0.032)}px system-ui, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`💡 Tip #${tipIndex + 1}`, boxX + pad, boxY + pad * 0.7);

    // Текст совета с переносом
    ctx.fillStyle = 'rgba(220, 235, 255, 0.95)';
    ctx.font = `${Math.round(cW * 0.038)}px system-ui, sans-serif`;
    ctx.textBaseline = 'top';

    const words = tip.text.split(' ');
    const maxW  = boxW - pad * 2;
    const lineH = cW * 0.048;
    let line    = '';
    let lineY   = boxY + pad * 2.0;

    for (const word of words) {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, boxX + pad, lineY);
        line  = word;
        lineY += lineH;
        if (lineY + lineH > boxY + boxH - pad * 0.5) break;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, boxX + pad, lineY);

    ctx.restore();
  }

  function loop(ts) {
    if (!phase) return;
    const dt = lastTs ? Math.min(ts - lastTs, 50) : 16;
    lastTs = ts;

    if (isMobile()) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (phase >= 3) drawMobileTip();
      animFrame = requestAnimationFrame(loop);
      return;
    }

    if (phase >= 3) drumAngle += 0.013 * (dt / 16);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const m = map();
    drawPowerBtn(m);
    drawKnob(m);
    if (phase >= 2) drawDisplay(m);
    if (phase >= 3) { drawDrum(m); drawTip(m); }
    animFrame = requestAnimationFrame(loop);
  }

  // ── Фазы ─────────────────────────────────────────────────────────────────
  function startPhase1() {
    if (isMobile()) {
      phase = 3;
      drumAngle = 0;
      lastTs = 0;
      totalSecs = 1800;
      startTips();
      animFrame = requestAnimationFrame(loop);
      return;
    }
    phase = 1; drumAngle = 0; lastTs = 0;
    animFrame = requestAnimationFrame(loop);

    p2Timer = setTimeout(() => {
      phase = 2;
      totalSecs = 1800;
      blinkOn = true;
      blinkCount = 0;
      dryBlink = true;
      dryBlinkTimer = setInterval(() => { dryBlink = !dryBlink; }, 800);
      blinkTimer = setInterval(() => {
        blinkOn = !blinkOn;
        blinkCount++;
        if (blinkCount >= 6) {
          clearInterval(blinkTimer);
          blinkTimer = null;
          blinkOn = true;
          p3Timer = setTimeout(() => {
            phase = 3;
            startTips();
            countTimer = setInterval(() => {
              if (totalSecs > 0) totalSecs--;
            }, 1000);
          }, 400);
        }
      }, 300);
    }, PHASE2_MS);
  }

  function stopAll() {
    phase = 0;
    clearTimeout(p2Timer);
    clearTimeout(p3Timer);
    clearInterval(blinkTimer);
    clearInterval(countTimer);
    clearInterval(dryBlinkTimer);
    stopTips();
    cancelAnimationFrame(animFrame);
    animFrame = blinkTimer = countTimer = dryBlinkTimer = null;
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function resetIdleTimer() {
    if (phase > 0) stopAll();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startPhase1, IDLE_MS);
  }

  function onActivity() { resetIdleTimer(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
