/**
 * LG Dryer Hero — Idle Animation v5
 */
(function () {
  'use strict';

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
    ['mousemove','mousedown','keydown','scroll','touchstart','click'].forEach(ev => {
      document.addEventListener(ev, onActivity, { passive: true });
    });
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

  // ── Цикл ─────────────────────────────────────────────────────────────────
  function loop(ts) {
    if (!phase) return;
    const dt = lastTs ? Math.min(ts - lastTs, 50) : 16;
    lastTs = ts;
    if (phase >= 3) drumAngle += 0.013 * (dt / 16);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const m = map();
    drawPowerBtn(m);
    drawKnob(m);
    if (phase >= 2) drawDisplay(m);
    if (phase >= 3) drawDrum(m);
    animFrame = requestAnimationFrame(loop);
  }

  // ── Фазы ─────────────────────────────────────────────────────────────────
  function startPhase1() {
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
