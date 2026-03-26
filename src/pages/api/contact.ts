export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { type, phone, name, address, time, comments } = body;

    // Validate — phone is always required
    if (!phone) {
      return new Response(JSON.stringify({ ok: false, error: 'Phone number is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const now = new Date().toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const env = locals.runtime?.env ?? (import.meta as any).env ?? {};
    const RESEND_API_KEY = env.RESEND_API_KEY;
    const TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = env.TELEGRAM_CHAT_ID;
    const NOTIFY_EMAIL = env.NOTIFY_EMAIL || 'info@lgdryer.repair';

    let telegramText = '';
    let emailSubject = '';
    let emailHtml = '';

    if (type === 'callback') {
      telegramText =
        `📞 *CALLBACK REQUEST — lgdryer.repair*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `📱 Phone: ${phone}\n` +
        `🕐 Received: ${now}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `_LG Dryer Repair Los Angeles_`;

      emailSubject = `📞 Call Back Request — ${phone}`;
      emailHtml = `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#0a0a0a;color:#fff;border-radius:12px;overflow:hidden">
          <div style="background:#1a6cf6;padding:20px 24px">
            <h2 style="margin:0;font-size:18px">📞 Callback Request</h2>
            <p style="margin:4px 0 0;opacity:.8;font-size:13px">lgdryer.repair</p>
          </div>
          <div style="padding:24px">
            <p style="margin:0 0 8px"><strong>Phone:</strong> ${phone}</p>
            <p style="margin:0 0 8px"><strong>Received:</strong> ${now}</p>
            <p style="margin:24px 0 0;font-size:13px;opacity:.6">LG Dryer Repair Los Angeles — Same Day Appliance Repair</p>
          </div>
        </div>`;
    } else {
      // Full booking
      const lines = [
        `📅 *BOOKING REQUEST — lgdryer.repair*`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `📱 Phone: ${phone}`,
        name    ? `👤 Name: ${name}`       : null,
        address ? `📍 Address: ${address}` : null,
        time    ? `🕐 Preferred time: ${time}` : null,
        comments? `💬 Comments: ${comments}` : null,
        `━━━━━━━━━━━━━━━━━━━━`,
        `_Received: ${now}_`,
        `_LG Dryer Repair Los Angeles_`,
      ].filter(Boolean).join('\n');

      telegramText = lines;

      emailSubject = `📅 Booking Request — ${name || phone}`;
      emailHtml = `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#0a0a0a;color:#fff;border-radius:12px;overflow:hidden">
          <div style="background:#1a6cf6;padding:20px 24px">
            <h2 style="margin:0;font-size:18px">📅 Booking Request</h2>
            <p style="margin:4px 0 0;opacity:.8;font-size:13px">lgdryer.repair</p>
          </div>
          <div style="padding:24px">
            <p style="margin:0 0 8px"><strong>Phone:</strong> ${phone}</p>
            ${name     ? `<p style="margin:0 0 8px"><strong>Name:</strong> ${name}</p>` : ''}
            ${address  ? `<p style="margin:0 0 8px"><strong>Address:</strong> ${address}</p>` : ''}
            ${time     ? `<p style="margin:0 0 8px"><strong>Preferred time:</strong> ${time}</p>` : ''}
            ${comments ? `<p style="margin:0 0 8px"><strong>Comments:</strong> ${comments}</p>` : ''}
            <p style="margin:16px 0 0;font-size:12px;opacity:.5">Received: ${now}</p>
            <p style="margin:4px 0 0;font-size:13px;opacity:.6">LG Dryer Repair Los Angeles — Same Day Appliance Repair</p>
          </div>
        </div>`;
    }

    const results = await Promise.allSettled([
      // Telegram
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramText,
          parse_mode: 'Markdown'
        })
      }),

      // Resend email
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'LG Dryer Repair <notifications@lgdryer.repair>',
          to: [NOTIFY_EMAIL],
          subject: emailSubject,
          html: emailHtml
        })
      })
    ]);

    // Log any failures but still return success to user
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`Notification ${i === 0 ? 'Telegram' : 'Email'} failed:`, r.reason);
      }
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error('Contact API error:', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
