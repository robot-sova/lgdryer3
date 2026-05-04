# Form Submission + Telegram Notification — Implementation Guide

A self-contained guide to the exact system used by `lgdryer.repair` to capture form submissions, forward them to a Telegram group, and send an email copy via Resend. Portable to any Astro + Cloudflare Pages project.

---

## How Form Submission Works

End-to-end flow for a typical booking submission:

1. **User fills out a form** on a static Astro page (e.g. `/book/`, `/`, `/areas/lg-dryer-repair-beverly-hills/`, `/careers/`, `/property-managers/`).
2. **User clicks the submit button.** Client-side JavaScript in a `<script>` tag inside the `.astro` page collects field values, builds a JSON payload, and calls `fetch('/api/contact', { method: 'POST', ... })`.
3. **Cloudflare Pages Functions intercepts** the request. Because the repo contains `functions/api/contact.js`, Cloudflare Pages automatically exposes it as `POST /api/contact` on the same origin as the static site — no Astro SSR adapter is involved. The static site stays `output: 'static'`.
4. **Inside `contact.js` (`onRequestPost`)**:
   - Reads JSON body.
   - Builds an email body text depending on `payload.type` (`'callback'` vs booking).
   - Sends email via Resend API (`https://api.resend.com/emails`) using `env.RESEND_API_KEY`, from `noreply@lgdryer.repair`, to `info@lgdryer.repair`.
   - Builds a Telegram message text depending on whether it's an AI-diagnostics log, callback, or booking.
   - POSTs to `https://api.telegram.org/bot<TOKEN>/sendMessage` with `{ chat_id, text }` using `env.TELEGRAM_BOT_TOKEN` and `env.TELEGRAM_CHAT_ID`.
   - Returns `{ ok: true }` as JSON.
5. **Browser receives 200** and the page shows a success state (`bookingSuccess` div is unhidden; the form is hidden).
6. **Telegram bot posts the message** to the configured group chat; team members see it within seconds. Email arrives at `info@lgdryer.repair`.

There is a **second Function** (`functions/api/diagnose.js`) used by the homepage AI widget. It proxies the user's question to `api.anthropic.com/v1/messages` using `env.ANTHROPIC_API_KEY`, returns the AI reply to the browser, and the browser then calls `/api/contact` a second time to log the full conversation to Telegram as a `🤖 AI Diagnostics` event.

Payload shapes seen in the codebase:

| Caller | JSON payload shape | Telegram branch taken |
|---|---|---|
| `book.astro` | `{ type: 'booking', phone, name, address, time, comments }` | `📅 NEW BOOKING REQUEST` |
| `index.astro` hero Callback tab | `{ type: 'callback', phone }` | `📞 CALLBACK REQUEST` |
| `index.astro` hero Booking tab | `{ type: 'booking', phone, name, address, time }` | `📅 NEW BOOKING REQUEST` |
| `index.astro` AI-diag logger | `{ name: '🤖 AI Diagnostics', email, phone, message }` | `🤖 AI Diagnostics` (name includes 'AI Diagnostics') |
| `AreaLayout.astro` callback form | `{ name: 'Call Back Request', phone, message, email }` | `📅 NEW BOOKING REQUEST` (no `type: 'callback'` is set, so falls to default booking branch) |
| `careers.astro`, `property-managers.astro` | `{ name, email, phone, message }` | default booking branch |

---

## Files Involved

| Path | Role |
|---|---|
| `src/pages/book.astro` | Booking page — form HTML + inline `<script>` that POSTs to `/api/contact` |
| `src/pages/index.astro` | Homepage — hero Callback/Booking tabs + AI diagnostics widget, both hit `/api/contact`; AI widget also hits `/api/diagnose` |
| `src/layouts/AreaLayout.astro` | Inline callback form on every city area page, POSTs to `/api/contact` |
| `src/pages/careers.astro` | Careers application form → `/api/contact` |
| `src/pages/property-managers.astro` | B2B contact form → `/api/contact` |
| `functions/api/contact.js` | Cloudflare Pages Function — the single server-side endpoint that forwards everything to Resend + Telegram |
| `functions/api/diagnose.js` | Cloudflare Pages Function — proxies AI requests to Anthropic |
| `.env` (project root, git-ignored) | Local dev secrets. On Cloudflare, these same names are set in the Pages dashboard as environment variables. |
| `astro.config.mjs` | Confirms `output: 'static'`. Functions run alongside the static build on Cloudflare Pages. |
| `package.json` | Declares `wrangler` — used for local dev of Functions and type generation. |

---

## Complete Code

### `functions/api/contact.js` (full)

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
    tgText = `📅 NEW BOOKING REQUEST\nPhone: ${payload.phone}\nName: ${payload.name || ''}\nAddress: ${payload.address || ''}\nTime: ${payload.time || ''}\nComments: ${payload.comments || ''}`;
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

### `functions/api/diagnose.js` (full)

```js
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { userInput } = await request.json();

    if (!userInput || typeof userInput !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Truncate input to prevent abuse
    const sanitizedInput = userInput.slice(0, 1000);

    const systemPrompt = `You are an expert LG dryer repair technician with 15 years of experience.
A customer is describing a problem with their LG dryer.
Provide a helpful diagnosis in 3-4 sentences.
Mention the most likely cause, estimated repair cost range ($150-$480),
and recommend calling (323) 990-7550 for same-day professional service.
Be specific about LG models when relevant.
End with: actual prices are often lower due to bulk parts discounts.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `${systemPrompt}\n\nCustomer issue: ${sanitizedInput}`
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || 'Please call (323) 990-7550 for a free phone diagnosis.';

    return new Response(JSON.stringify({ result: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      result: 'Could not connect to AI service. Please call (323) 990-7550 for a free phone diagnosis.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

### `src/pages/book.astro` (full)

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

### `astro.config.mjs` (full)

```js
// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lgdryer.repair',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/washer/') })],
});
```

### `AreaLayout.astro` — callback form (relevant snippet)

```html
<form class="callback-form" id="callbackForm">
  <input type="tel" id="callbackPhone" name="phone" placeholder="(XXX) XXX-XXXX" required />
  <button type="submit" class="callback-btn">Call Me Back</button>
</form>

<script>
  const callbackForm = document.getElementById('callbackForm');
  callbackForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = (document.getElementById('callbackPhone') as HTMLInputElement).value;
    const city = (document.querySelector('meta[name="city"]') as HTMLMetaElement)?.content || 'Unknown';
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Call Back Request',
        phone,
        message: `Call back request from ${city} area page`,
        email: 'callback@lgdryer.repair'
      })
    });
  });
</script>
```

### `.env` (root, git-ignored) — variable names only

```
PUBLIC_ANTHROPIC_KEY=...
PUBLIC_TELEGRAM_BOT_TOKEN=...
PUBLIC_TELEGRAM_CHAT_ID=...
PUBLIC_RESEND_API_KEY=...
```

> ⚠️ Note the mismatch: the local `.env` uses `PUBLIC_*` prefixes, but `functions/api/*.js` reads **non-prefixed** names (`env.TELEGRAM_BOT_TOKEN`, `env.TELEGRAM_CHAT_ID`, `env.RESEND_API_KEY`, `env.ANTHROPIC_API_KEY`). In production on Cloudflare Pages, the Functions runtime reads from **Pages environment variables**, not from `.env`. The local `.env` file is not actually consumed by the Functions — for local dev of Functions via `wrangler pages dev`, use `.dev.vars` (see below). On the live Cloudflare deployment, variables are set without the `PUBLIC_` prefix directly in the Pages dashboard.

---

## Environment Variables Required

Set these as **Cloudflare Pages → Settings → Environment variables**, and locally in `.dev.vars` (for `wrangler pages dev`).

| Variable | Contents | Where to get it |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Bot API token like `1234567890:AAHxxxx...` | Talk to `@BotFather` on Telegram → `/newbot` → copy the token |
| `TELEGRAM_CHAT_ID` | Numeric chat ID of the destination. Private chat: positive integer. Group: negative. Supergroup/channel: starts with `-100...`. | Add bot to the group → send any message → GET `https://api.telegram.org/bot<TOKEN>/getUpdates` → read `message.chat.id` |
| `RESEND_API_KEY` | API key `re_...` | [resend.com](https://resend.com) → API Keys → Create API Key. Verify a sending domain (e.g. `yourdomain.com`) to allow `from: 'noreply@yourdomain.com'`. |
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` | [console.anthropic.com](https://console.anthropic.com) → API Keys. Only needed if you use the `/api/diagnose` endpoint. |

---

## How to Replicate on a New Project

Assumes a fresh Astro project deployed to Cloudflare Pages.

### 1. Astro config

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://your-domain.example',
  output: 'static',
  trailingSlash: 'always',
});
```

No SSR adapter. Static output. Cloudflare Pages will auto-deploy Functions from a sibling `functions/` directory alongside the static output.

### 2. Install deps

```
npm install astro wrangler
```

### 3. Create the Pages Function for form handling

Create `functions/api/contact.js` — copy the verbatim file from the "Complete Code" section above. Adjust these three things for your project:

- `from: 'noreply@lgdryer.repair'` → your verified Resend sender address
- `to: 'info@lgdryer.repair'` → the inbox that should receive emails
- Subject lines if you want different emojis/phrasing

If you don't want email (Telegram only), delete the Resend `fetch` block.

### 4. (Optional) Create the AI proxy

Create `functions/api/diagnose.js` — copy verbatim from the "Complete Code" section. Only needed if you want a user-facing AI tool; otherwise skip.

### 5. Build a form page

Copy the `<script>` pattern from `book.astro`. The essentials:

```html
<script>
  btn.addEventListener('click', async () => {
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'booking',           // or 'callback'
        phone, name, address, time, comments
      })
    });
    // toggle UI to success state
  });
</script>
```

The contact Function keys off `payload.type` and `payload.name?.includes('AI Diagnostics')`. To add new message templates, edit the `tgText` branching in `contact.js`.

### 6. Local development of Functions

Astro's dev server (`astro dev`) does **not** run Pages Functions. To test `/api/contact` locally you must run Wrangler:

```
npm run build
npx wrangler pages dev ./dist --compatibility-date=2024-01-01
```

Put local secrets in a file named `.dev.vars` at the project root (not `.env`):

```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
RESEND_API_KEY=...
ANTHROPIC_API_KEY=...
```

Add `.dev.vars` to `.gitignore`.

### 7. Cloudflare Pages configuration

In the Cloudflare dashboard:

1. **Pages → Create project → Connect to Git** → select your repo.
2. **Build settings:** Framework preset `Astro`, build command `npm run build`, build output `dist`.
3. **Settings → Environment variables** → add each variable (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `RESEND_API_KEY`, optionally `ANTHROPIC_API_KEY`) for **Production** and **Preview** environments.
4. Deploy. Cloudflare will auto-detect `functions/api/contact.js` and expose it at `https://your-project.pages.dev/api/contact`.
5. Custom domain: **Custom domains** tab → add your domain → follow DNS instructions.

### 8. (If using Resend) verify sending domain

In Resend dashboard → **Domains** → Add domain → copy SPF/DKIM/DMARC records into your DNS → wait for "Verified". Only then can the Function send from `noreply@<your-domain>`.

---

## Telegram Setup

### Create the bot

1. Open Telegram, chat with `@BotFather`.
2. Send `/newbot`. Pick a name (e.g. `My Site Alerts`) and username (must end in `bot`, e.g. `mysite_alerts_bot`).
3. BotFather replies with the token — a string like `8616157893:AAF8w_szXWfSZD8t4NaLQLm202wG4k8CjPw`. This is your `TELEGRAM_BOT_TOKEN`. Keep it secret.

### Create the destination group/channel

1. In Telegram, create a new group (or use an existing one). Add a few team members.
2. Add the bot you just created to the group (Group → Add Members → search by username).
3. If you want the bot to read all messages (not required for sending), use `/setprivacy` in BotFather and set it to `Disable`.
4. Promote the bot to admin if you're using a channel (channels require admin rights to post).

### Find the chat ID

1. In the group, send any message (e.g. `hello`).
2. In a browser, open:
   `https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getUpdates`
3. Look for `"chat":{"id":-1003836263121,...}`. That negative number is your `TELEGRAM_CHAT_ID`.
   - Supergroups and channels: starts with `-100...`
   - Regular groups: starts with `-`
   - Private chat with the bot: positive integer

### Test

`curl` the Bot API directly to confirm everything works before wiring up the site:

```
curl -X POST "https://api.telegram.org/bot<TOKEN>/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{"chat_id":"<CHAT_ID>","text":"test message"}'
```

If the message appears in your group, set the two variables in Cloudflare Pages and the production form will start delivering.

### Message formatting (optional upgrade)

The current implementation sends plain text. To use bold/italic/links, add `"parse_mode": "HTML"` or `"MarkdownV2"` to the Telegram payload:

```js
body: JSON.stringify({
  chat_id: telegramChatId,
  text: `<b>📅 NEW BOOKING</b>\n<b>Phone:</b> ${payload.phone}`,
  parse_mode: 'HTML'
})
```
