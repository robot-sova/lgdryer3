# Book Online — полная реализация

Документ описывает, как устроена кнопка **Book Online** и страница `/book/` на сайте `lgdryer.repair`.

---

## 1. Страница `/book/`

**Файл:** `src/pages/book.astro`
**Layout:** `src/layouts/Layout.astro` (импортируется как `Layout from '../layouts/Layout.astro'`)
**Title:** `"Book LG Dryer Repair | Los Angeles"`
**Description:** не передаётся в Layout (используется значение по умолчанию из Layout).
**JSON-LD schema:** отсутствует (нет ни `Reservation`, ни `ReserveAction`, ни любой другой schema на этой странице).

### Поля формы

Все инпуты — обычный HTML, **без `<form>` тега и без атрибута `required`**. Валидация делается вручную в JS (только проверка телефона).

| id | type | label | placeholder | обязательно |
|---|---|---|---|---|
| `name` | text | Full Name | `John Smith` | нет |
| `phone` | tel | Phone Number | `(323) 555-0100` | **да** (JS-проверка) |
| `email` | email | Email (optional) | `john@example.com` | нет |
| `address` | text | Service Address | `123 Main St, Los Angeles, CA` | нет |
| `model` | text | LG Dryer Model (if known) | `e.g. DLEX9000V` | нет |
| `date` | date | Preferred Date | — | нет |
| `time` | select | Preferred Time | options: `8–10`, `10–12`, `12–2`, `2–4`, `4–6` | нет |
| `issue` | textarea | Describe the Issue | `e.g. My dryer runs but doesn't heat...` | нет |

Кнопки:
- `#confirmBtn` (`.btn .btn-primary .btn-lg`) — отправка формы
- `tel:3239907550` (`.btn .btn-secondary .btn-lg`) — «Or Call (323) 990-7550»

После успеха показывается блок `#bookingSuccess` с галкой и текстом:
> ✓ Booking Confirmed! We'll call you to confirm within 15 minutes during business hours (Mon–Sat 8AM–8PM).

### Полный исходник `src/pages/book.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Book LG Dryer Repair | Los Angeles">
  <section class="page-hero">
    <div class="container">
      <span class="badge badge-blue">Schedule Service</span>
      <h1>Book Your LG Dryer Repair</h1>
      <p class="subtitle">Same-day appointments available — $65 diagnostic fee waived with repair</p>
    </div>
  </section>

  <section class="section">
    <div class="container" style="max-width:600px">
      <div class="glass" id="bookingForm">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input type="text" id="name" class="form-input" placeholder="John Smith" />
        </div>
        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input type="tel" id="phone" class="form-input" placeholder="(323) 555-0100" />
        </div>
        <div class="form-group">
          <label for="email">Email (optional)</label>
          <input type="email" id="email" class="form-input" placeholder="john@example.com" />
        </div>
        <div class="form-group">
          <label for="address">Service Address</label>
          <input type="text" id="address" class="form-input" placeholder="123 Main St, Los Angeles, CA" />
        </div>
        <div class="form-group">
          <label for="model">LG Dryer Model (if known)</label>
          <input type="text" id="model" class="form-input" placeholder="e.g. DLEX9000V" />
        </div>
        <div class="form-group">
          <label for="date">Preferred Date</label>
          <input type="date" id="date" class="form-input" />
        </div>
        <div class="form-group">
          <label for="time">Preferred Time</label>
          <select id="time" class="form-input">
            <option value="">Select a time window...</option>
            <option>8:00 AM – 10:00 AM</option>
            <option>10:00 AM – 12:00 PM</option>
            <option>12:00 PM – 2:00 PM</option>
            <option>2:00 PM – 4:00 PM</option>
            <option>4:00 PM – 6:00 PM</option>
          </select>
        </div>
        <div class="form-group">
          <label for="issue">Describe the Issue</label>
          <textarea id="issue" class="diagnose-textarea" rows="4" placeholder="e.g. My dryer runs but doesn't heat..."></textarea>
        </div>

        <button id="confirmBtn" class="btn btn-primary btn-lg" style="width:100%;justify-content:center;margin-bottom:.75rem">Confirm Booking</button>
        <a href="tel:3239907550" class="btn btn-secondary btn-lg" style="width:100%;justify-content:center">Or Call (323) 990-7550</a>
      </div>

      <div id="bookingSuccess" class="glass" style="display:none;text-align:center;padding:3rem 2rem">
        <div style="font-size:3rem;margin-bottom:1rem">✓</div>
        <h2 style="margin-bottom:.5rem">Booking Confirmed!</h2>
        <p class="text-secondary" id="successDetail">We'll call you to confirm within 15 minutes during business hours (Mon–Sat 8AM–8PM).</p>
        <a href="tel:3239907550" class="btn btn-primary" style="margin-top:1.5rem">Call (323) 990-7550</a>
      </div>
    </div>
  </section>
</Layout>

<script>
  const confirmBtn = document.getElementById('confirmBtn') as HTMLButtonElement;

  confirmBtn?.addEventListener('click', async () => {
    const phone = (document.getElementById('phone') as HTMLInputElement).value.trim();
    if (!phone) { alert('Please enter your phone number.'); return; }

    const name = (document.getElementById('name') as HTMLInputElement).value.trim();
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    const address = (document.getElementById('address') as HTMLInputElement).value.trim();
    const model = (document.getElementById('model') as HTMLInputElement).value.trim();
    const date = (document.getElementById('date') as HTMLInputElement).value;
    const time = (document.getElementById('time') as HTMLSelectElement).value;
    const issue = (document.getElementById('issue') as HTMLTextAreaElement).value.trim();

    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Sending...';

    try {
      // Send via server-side proxy (handles both Resend email and Telegram)
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'booking', phone, name, address, time: `${date} ${time}`, comments: `Model: ${model}\n${issue}` })
        });
      } catch (e) { console.error('Resend error:', e); }

      // Show success
      document.getElementById('bookingForm')!.style.display = 'none';
      document.getElementById('bookingSuccess')!.style.display = 'block';
    } catch {
      alert('Network error. Please call (323) 990-7550 directly.');
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Confirm Booking';
    }
  });
</script>
```

### Что отправляется на бэкенд

POST на `/api/contact`, JSON-body:

```json
{
  "type": "booking",
  "phone": "...",
  "name": "...",
  "address": "...",
  "time": "<date> <timeWindow>",
  "comments": "Model: <model>\n<issue text>"
}
```

⚠️ Поле `email` собирается из формы, но **не отправляется** на сервер (баг — пропадает между сбором и `JSON.stringify`).

---

## 2. Backend для формы

**Тип:** Cloudflare Pages Function.
**Файл:** `functions/api/contact.js` → endpoint `/api/contact`.
Других API-endpoint'ов нет (есть `functions/api/diagnose.js` для AI-диагностики, но к Book не относится).

### Полный код `functions/api/contact.js`

```js
export async function onRequestPost(context) {
  const { request, env } = context;
  const payload = await request.json();

  const text = payload.type === 'callback'
    ? `NEW CALLBACK REQUEST\nPhone: ${payload.phone}`
    : `NEW BOOKING REQUEST\nPhone: ${payload.phone}\nName: ${payload.name || ''}\nAddress: ${payload.address || ''}\nTime: ${payload.time || ''}\nComments: ${payload.comments || ''}`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'noreply@lgdryer.repair',
      to: 'info@lgdryer.repair',
      subject: payload.type === 'callback' ? '📞 New Callback Request' : '📅 New Booking Request',
      text: text
    })
  });

  // Send to Telegram for ALL request types
  const telegramToken = env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = env.TELEGRAM_CHAT_ID;

  let tgText;
  if (payload.name?.includes('AI Diagnostics')) {
    tgText = `🤖 AI Diagnostics\n\n${payload.message || ''}`;
  } else if (payload.type === 'callback') {
    tgText = `📞 CALLBACK REQUEST\nPhone: ${payload.phone}`;
  } else {
    tgText = `🔧 NEW BOOKING REQUEST\n🌐 Source: appliancerepairdaily.com\nPhone: ${payload.phone}\nName: ${payload.name || ''}\nAppliance: ${payload.appliance || ''}\nTime: ${payload.time || ''}`;
  }

  await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: telegramChatId,
      text: tgText
    })
  });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### Что делает

1. **Resend (email).** POST на `https://api.resend.com/emails`. От `noreply@lgdryer.repair` → на `info@lgdryer.repair`.
   - Subject: `📅 New Booking Request` (или `📞 New Callback Request`).
   - Plain-text тело с полями `Phone / Name / Address / Time / Comments`.

2. **Telegram.** POST на `https://api.telegram.org/bot{TOKEN}/sendMessage`.
   - Три ветки сообщения: `AI Diagnostics`, `CALLBACK REQUEST`, иначе — `NEW BOOKING REQUEST`.

3. Возврат: всегда `{ ok: true }` со статусом 200, **независимо от успеха внешних API** (errors не ловятся, `response.ok` не проверяется).

### Переменные окружения (без значений)

| Переменная | Использование |
|---|---|
| `RESEND_API_KEY` | Bearer-токен для Resend API |
| `TELEGRAM_BOT_TOKEN` | Bot-token для Telegram (часть URL) |
| `TELEGRAM_CHAT_ID` | ID чата куда падают уведомления |

### ⚠️ Замечания / баги

- `🌐 Source: appliancerepairdaily.com` зашит в Telegram-сообщение, но домен сайта — `lgdryer.repair`. Похоже, остаток от другого проекта.
- `payload.appliance` всегда пустой (фронт `book.astro` не отправляет такое поле).
- `email` из формы **не передаётся** на сервер (см. баг выше).
- Ошибки сети в Resend/Telegram игнорируются — функция вернёт `ok: true`, даже если уведомления не дошли.
- Нет CORS-headers, нет валидации payload, нет защиты от спама / rate-limit.

---

## 3. Кнопки "Book Online" в layouts

### `src/layouts/RepairLayout.astro` (строки 83–89)

```astro
<div class="article-sidebar">
  <div class="sidebar-cta">
    <div class="s-title">Same Day Service</div>
    <div class="s-sub">Mon–Sat 8am–8pm · OEM parts</div>
    <a href="tel:(323)990-7550" class="s-phone">(323) 990-7550</a>
    <a href="/book/" class="s-btn">Book Online</a>
  </div>
```

### `src/layouts/SymptomLayout.astro` (строки 63–69)

```astro
<div class="article-sidebar">
  <div class="sidebar-cta">
    <div class="s-title">Same Day Service</div>
    <div class="s-sub">Mon–Sat 8am–8pm · OEM parts</div>
    <a href="tel:(323)990-7550" class="s-phone">(323) 990-7550</a>
    <a href="/book/" class="s-btn">Book Online</a>
  </div>
```

### `src/layouts/PriceLayout.astro` (строки 104–110)

```astro
<div class="article-sidebar">
  <div class="sidebar-cta">
    <div class="s-title">Get Exact Quote</div>
    <div class="s-sub">$65 diagnostic · waived with repair</div>
    <a href="tel:(323)990-7550" class="s-phone">(323) 990-7550</a>
    <a href="/book/" class="s-btn">Book Online</a>
  </div>
```

### `src/layouts/AreaLayout.astro` (строки 150–159)

```astro
<div class="article-sidebar">
  <div class="sidebar-cta">
    <div class="s-title">{city} Service</div>
    <div class="s-sub">{responseTime} · Same day</div>
    <a href="tel:(323)990-7550" class="s-phone">(323) 990-7550</a>
    <a href="/book/" class="s-btn">Book in {city}</a>
    <a href="#callback-form" class="sidebar-callback-link">
      Or request a call back ↓
    </a>
  </div>
```

(Текст кнопки динамический: `Book in Pasadena`, `Book in Irvine` и т.д.)

### `src/layouts/RepairLayoutV2.astro` (строка 81)

```astro
<a href="/book/" class="s-btn">Book Online</a>
```

(Структура `.sidebar-cta` — такая же, как у RepairLayout.)

### `src/layouts/Layout.astro` — навбар vs футер

- **В навбаре кнопки Book НЕТ.** В навбаре только обычные ссылки разделов и телефон.
- **В футере** (строки 329–340):

```astro
<div>
  <h4>Quick Links</h4>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/book/">Book a Visit</a></li>
    <li><a href="/how-it-works/">How it works</a></li>
    <li><a href="/property-managers/">For property managers</a></li>
    <li><a href="/about/">About Us</a></li>
    <li><a href="/careers/">Careers</a></li>
    <li><a href="/sitemap.xml">Sitemap</a></li>
  </ul>
</div>
```

Footer-ссылки наследуют общие стили `<a>` без отдельного класса.

---

## 4. CSS стили кнопки

Все классы — в `src/styles/global.css` (минифицированы и расширены ниже).

### `.btn` + `.btn-primary` / `.btn-secondary` / `.btn-lg` (используются на самой странице `/book/`)

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: .95rem;
  cursor: pointer;
  border: none;
  transition: all .2s ease;
}
.btn-primary { background: #1a6cf6; color: #fff; }
.btn-primary:hover { background: #1558d6; transform: translateY(-1px); }
.btn-secondary {
  background: rgba(255,255,255,0.08);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.12);
}
.btn-secondary:hover { background: rgba(255,255,255,0.12); }
.btn-lg { padding: 1rem 2rem; font-size: 1.05rem; }
```

### `.button-85` — большая «лендинговая» кнопка (используется на index-страницах разделов и в symptoms/*)

```css
.button-85 {
  display: inline-block;
  padding: 14px 40px;
  background: #1a6cf6;
  color: #ffffff !important;
  text-decoration: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  transition: background 0.2s;
}
.button-85:hover { background: #1558d0; }
```

### `.cta-buttons` — контейнер CALL+BOOK (определён дважды)

Базовое определение (строка 137):
```css
.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
```

Расширенное (строки 939–950) — переопределяет `gap` и добавляет вертикальные отступы + `min-width` для дочерних `.button-85`:
```css
.cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 32px 0;
}
.cta-buttons .button-85 {
  min-width: 160px;
  text-align: center;
}
```

### `.sidebar-cta` (синий бокс в правом сайдбаре всех layouts)

```css
.sidebar-cta {
  background: #1a6cf6;
  border-radius: 10px;
  padding: 22px;
  margin-bottom: 16px;
  text-align: center;
}
.sidebar-cta .s-title {
  font-size: 1rem;
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 4px;
}
.sidebar-cta .s-sub {
  font-size: 11px;
  color: rgba(255,255,255,0.7);
  margin-bottom: 12px;
}
.sidebar-cta .s-phone {
  font-size: 1.4rem;
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 14px;
  display: block;
}
.sidebar-cta .s-btn {
  display: block;
  background: #ffffff;
  color: #1a6cf6;
  padding: 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
}
```

### Page-scoped CSS (не в global.css, но связанные)

- `.btn-outline` — определён в `<style>` `src/pages/about.astro:308-320`:
  ```css
  .btn-outline {
    background: transparent;
    border: 1px solid #1a6cf6;
    color: #1a6cf6;
    padding: 10px 24px;
    border-radius: 6px;
  }
  .btn-outline:hover { background: rgba(26, 108, 246, 0.1); }
  ```
- `.hiw-btn-secondary` — scoped в `src/pages/how-it-works.astro`.
- `.help-btn-secondary`, `.help-cta-book` — scoped в `src/pages/help/lg-dryer-fire-hazard.astro`.
- `.button-secondary` — scoped в `src/pages/help/lg-dryer-parts.astro`.

---

## 5. Где кнопка появляется (все вхождения `href="/book/"`)

Поиск по `src/`. Всего ~31 вхождение.

### Layouts (5 файлов)

| Файл | Строка | Класс кнопки | Текст |
|---|---|---|---|
| `src/layouts/Layout.astro` | 333 | (без класса, footer-link) | Book a Visit |
| `src/layouts/AreaLayout.astro` | 155 | `s-btn` | Book in {city} |
| `src/layouts/RepairLayout.astro` | 88 | `s-btn` | Book Online |
| `src/layouts/RepairLayoutV2.astro` | 81 | `s-btn` | Book Online |
| `src/layouts/PriceLayout.astro` | 109 | `s-btn` | Book Online |
| `src/layouts/SymptomLayout.astro` | 68 | `s-btn` | Book Online |

### Index-страницы разделов (`button-85`)

| Файл | Строка | Текст |
|---|---|---|
| `src/pages/areas/index.astro` | 76 | 📅 BOOK ONLINE |
| `src/pages/repairs/index.astro` | 43 | 📅 BOOK ONLINE |
| `src/pages/symptoms/index.astro` | 40 | 📅 BOOK ONLINE |

### Symptom-страницы (`button-85`, без эмодзи)

| Файл | Строка |
|---|---|
| `src/pages/symptoms/lg-dryer-flow-sense-error.astro` | 75 |
| `src/pages/symptoms/lg-dryer-not-drying.astro` | 94 |
| `src/pages/symptoms/lg-dryer-door-wont-close.astro` | 83 |
| `src/pages/symptoms/lg-dryer-overheating.astro` | 111 |
| `src/pages/symptoms/lg-dryer-making-noise.astro` | 78 |
| `src/pages/symptoms/lg-dryer-not-spinning.astro` | 91 |
| `src/pages/symptoms/lg-dryer-not-heating.astro` | 87 |
| `src/pages/symptoms/lg-dryer-not-starting.astro` | 93 |

### Контентные страницы

| Файл | Строка | Класс | Текст |
|---|---|---|---|
| `src/pages/about.astro` | 112 | `btn btn-outline` | Book Online |
| `src/pages/how-it-works.astro` | 17 | `hiw-btn-secondary` | Book Online |
| `src/pages/how-it-works.astro` | 47 | (inline-link) | Schedule a visit → |
| `src/pages/how-it-works.astro` | 298 | (inline-link в FAQ) | book online |
| `src/pages/how-it-works.astro` | 309 | `hiw-btn-secondary` | Book Online |
| `src/pages/help/lg-dryer-fire-hazard.astro` | 17 | `help-btn-secondary` | Book Same-Day Inspection |
| `src/pages/help/lg-dryer-fire-hazard.astro` | 129 | `help-cta-book` | Book Online |
| `src/pages/help/lg-dryer-fire-hazard.astro` | 263 | `help-btn-secondary` | Book Inspection Online |
| `src/pages/help/lg-dryer-parts.astro` | 272 | `button-secondary` | Book Online |
| `src/pages/help/lg-dryer-tips.astro` | 162 | `btn btn-secondary` | Book a Visit |
| `src/pages/help/lg-dryer-tips.astro` | 248 | `btn btn-secondary` | Book a Visit |
| `src/pages/help/lg-dryer-tips.astro` | 420 | `btn btn-secondary` | Book Online |
| `src/pages/help/lg-dryer-tips.astro` | 685 | `btn btn-secondary btn-lg` | Book a Visit |
| `src/pages/help/lg-dryer-tips.astro` | 704 | `s-btn` | Book Online |

---

## 6. Schema разметка

**В `src/pages/book.astro` JSON-LD schema отсутствует.**
Не добавлен ни `Reservation`, ни `ReserveAction`, ни `Service.potentialAction`. Если нужно — это явная точка для улучшения SEO/rich-results (можно добавить `ReserveAction` с `target` = `https://lgdryer.repair/book/`).

Глобальные `LocalBusiness` schemas есть в других layouts (`AreaLayout.astro`), но они привязаны к area-страницам, не к `/book/`.

---

## Сводка

| Слой | Что есть | Куда смотреть |
|---|---|---|
| Frontend форма | 8 полей, валидация только phone | `src/pages/book.astro` |
| API endpoint | Cloudflare Pages Function `/api/contact` | `functions/api/contact.js` |
| Email-доставка | Resend (`api.resend.com/emails`) | env `RESEND_API_KEY` |
| Уведомления | Telegram Bot API | env `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` |
| Кнопки в layouts | 6 layouts, классы `s-btn` / footer-link | `src/layouts/*.astro` |
| Кнопки в страницах | ~25 штук, классы `button-85`, `btn-secondary`, прочие | `src/pages/**` |
| CSS | `.btn`, `.button-85`, `.sidebar-cta + s-btn`, `.cta-buttons` | `src/styles/global.css` |
| Schema на `/book/` | **нет** | — |

### Ключевые баги/недочёты, найденные при аудите

1. `email` собирается формой, но не уходит на сервер.
2. Telegram-сообщение помечает source как `appliancerepairdaily.com` — устаревшая константа от другого сайта.
3. `payload.appliance` в Telegram всегда пустой — фронт такое поле не шлёт.
4. Backend всегда возвращает `{ ok: true }` — нет обработки ошибок Resend/Telegram.
5. На странице `/book/` нет JSON-LD schema (`ReserveAction` или `Service.potentialAction`).
6. Нет CORS-headers, валидации payload и rate-limit на `/api/contact`.
7. На `/book/` нет captcha/honeypot против спама.
