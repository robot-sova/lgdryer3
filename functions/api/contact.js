/**
 * POST /api/contact — every form on the site posts here: the hero callback / booking tabs,
 * /book/, the "call me back" box on the area pages, the AI diagnosis widget, /property-managers/
 * and /careers/.
 *
 * Leads go to ЦУП (the dispatch system), exactly like the other brand sites:
 *   POST {CUP_WEBHOOK_URL | https://cup-production-48f8.up.railway.app/webhooks/web-lead}
 *   header x-web-lead-token: env.WEB_LEAD_TOKEN   ← secret in CF Pages settings, never in code
 * ЦУП stores the lead (cup.web_lead, source "lgdryer.repair") and posts the card to the
 * dispatch group itself.
 *
 * Until 2026-10-04 this function wrote to Telegram directly and returned { ok: true } no
 * matter what happened. Consequences, all real:
 *   - the leads never reached ЦУП, so the site looked like it produced nothing;
 *   - the card said "Source: appliancerepairdaily.com" (copied from another project);
 *   - the Telegram text dropped the address, the model and the problem on /book/, the whole
 *     message on /property-managers/ and the city on the area pages — those went to email only;
 *   - an empty POST produced a "Phone: undefined" card in the dispatch group.
 *
 * Now:
 *   1. job applications (/careers/) are NOT leads — they go to Telegram + email as before;
 *   2. a lead needs a North American phone number, otherwise 400 with a message for the visitor;
 *   3. ЦУП is the primary path. If ЦУП does not accept the lead, the old channels (Telegram via
 *      the site bot + email) are the fallback, so a lead is never lost to an outage;
 *   4. the response tells the truth: 200 only when someone actually received the lead.
 */

const RECEIVER_DEFAULT = 'https://cup-production-48f8.up.railway.app/webhooks/web-lead';
const SOURCE = 'lgdryer.repair';
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const memRl = new Map();

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

const clip = (v, max) => String(v ?? '').trim().slice(0, max);

/** Ten digits, or eleven with the leading 1; area code does not start with 0 or 1. */
function callablePhone(raw) {
  const digits = String(raw ?? '').split(/x|ext/i)[0].replace(/\D/g, '');
  const ten = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  return ten.length === 10 && /^[2-9]/.test(ten) ? ten : '';
}

function allowedByRateLimit(ip) {
  const now = Date.now();
  const hits = (memRl.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_LIMIT) {
    memRl.set(ip, hits);
    return false;
  }
  hits.push(now);
  memRl.set(ip, hits);
  return true;
}

/** Which form sent this. The forms predate this function and do not all send `type`. */
function kindOf(p) {
  const name = String(p.name ?? '');
  const message = String(p.message ?? '');
  if (message.startsWith('[JOB APPLICATION')) return 'careers';
  if (message.startsWith('[CORPORATE CLIENT]')) return 'property_manager';
  if (name.includes('AI Diagnostics')) return 'ai_diagnosis';
  if (name === 'Call Back Request') return 'area_callback';
  if (p.type === 'callback') return 'callback';
  return 'booking';
}

const KIND_LABEL = {
  callback: 'Callback request (homepage)',
  area_callback: 'Callback request (area page)',
  booking: 'Booking request',
  property_manager: 'Property manager inquiry',
  ai_diagnosis: 'AI diagnosis on the homepage',
};

/** The forms fill name/email with placeholders of their own — those are not the customer's. */
const realName = (n) => {
  const s = clip(n, 100);
  return s === 'Call Back Request' || s.includes('AI Diagnostics') ? '' : s;
};
const realEmail = (e) => {
  const s = clip(e, 100);
  return /@lgdryer\.repair$/i.test(s) ? '' : s;
};

/** Map the site payload onto the ЦУП web-lead contract (source/name/phone/email/city/model/message/page). */
function toLead(p, kind, phone, page) {
  const comments = String(p.comments ?? '');
  const modelMatch = comments.match(/^Model:\s*(.*)$/m);
  const model = clip(modelMatch ? modelMatch[1] : p.model, 100);
  const problem = modelMatch ? comments.replace(/^Model:.*\n?/m, '').trim() : comments.trim();
  const areaCity = String(p.message ?? '').match(/^Call back request from (.+) area page$/);

  const lines = [`Form: ${KIND_LABEL[kind]}`];
  if (p.appliance) lines.push(`Appliance: ${clip(p.appliance, 40)}`);
  if (p.address) lines.push(`Address: ${clip(p.address, 200)}`);
  if (p.time && String(p.time).trim()) lines.push(`Preferred time: ${clip(p.time, 80)}`);
  if (problem) lines.push(`Problem: ${clip(problem, 1500)}`);
  if (p.message && !areaCity) lines.push('', clip(p.message, 1800));

  return {
    source: SOURCE,
    name: realName(p.name),
    phone,
    email: realEmail(p.email),
    city: areaCity ? clip(areaCity[1], 100) : '',
    model,
    message: lines.join('\n').slice(0, 2000),
    page: clip(page, 300),
  };
}

async function forwardToCup(env, lead) {
  if (!env.WEB_LEAD_TOKEN) return { ok: false, why: 'WEB_LEAD_TOKEN is not set' };
  try {
    const res = await fetch(env.CUP_WEBHOOK_URL || RECEIVER_DEFAULT, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-web-lead-token': env.WEB_LEAD_TOKEN },
      body: JSON.stringify(lead),
    });
    return res.ok ? { ok: true } : { ok: false, why: `ЦУП ${res.status}` };
  } catch (e) {
    return { ok: false, why: `ЦУП unreachable: ${e && e.message}` };
  }
}

async function sendTelegram(env, text) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, disable_web_page_preview: true }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function sendEmail(env, subject, text) {
  if (!env.RESEND_API_KEY) return false;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${env.RESEND_API_KEY}` },
      body: JSON.stringify({ from: 'noreply@lgdryer.repair', to: 'info@lgdryer.repair', subject, text }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const leadText = (lead) =>
  [
    `Phone: ${lead.phone}`,
    lead.name && `Name: ${lead.name}`,
    lead.email && `Email: ${lead.email}`,
    lead.city && `City: ${lead.city}`,
    lead.model && `Model: ${lead.model}`,
    lead.page && `Page: ${lead.page}`,
    '',
    lead.message,
  ]
    .filter((l) => l !== false && l !== undefined && l !== null)
    .join('\n');

const CALL_US = 'Please call or text (323) 990-7550 and a dispatcher will pick up.';

export async function onRequestPost({ request, env }) {
  const p = await request.json().catch(() => null);
  if (!p || typeof p !== 'object') return json(400, { ok: false, error: 'Bad request.' });

  const ip = request.headers.get('cf-connecting-ip') ?? '0.0.0.0';
  if (!allowedByRateLimit(ip)) {
    return json(429, { ok: false, error: `You have already sent us several requests in the last few minutes. ${CALL_US}` });
  }

  const kind = kindOf(p);
  const page = request.headers.get('referer') || '';

  // Job applications are not customer leads: keep them out of ЦУП.
  if (kind === 'careers') {
    const text = `👷 JOB APPLICATION (lgdryer.repair)\n\n${clip(p.message, 3000)}`;
    const [tg, mail] = await Promise.all([
      sendTelegram(env, text),
      sendEmail(env, '👷 New job application — lgdryer.repair', text),
    ]);
    return tg || mail ? json(200, { ok: true }) : json(502, { ok: false, error: `We could not send your application. ${CALL_US}` });
  }

  const phone = callablePhone(p.phone);
  if (!phone) {
    return json(400, {
      ok: false,
      field: 'phone',
      error: 'Please enter a US phone number with 10 digits so we can call you back.',
    });
  }

  const lead = toLead(p, kind, phone, page);
  const cup = await forwardToCup(env, lead);
  if (cup.ok) return json(200, { ok: true });

  // ЦУП did not take it — the lead must still reach a human.
  const text = `⚠️ ЦУП did not accept this lead (${cup.why}) — reserve copy\n🌐 lgdryer.repair\n\n${leadText(lead)}`;
  const [tg, mail] = await Promise.all([
    sendTelegram(env, text),
    sendEmail(env, '⚠️ New lead (ЦУП did not accept it) — lgdryer.repair', text),
  ]);
  if (tg || mail) return json(200, { ok: true });
  return json(502, { ok: false, error: `We could not send your request. ${CALL_US}` });
}
