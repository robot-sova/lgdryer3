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
      'Authorization': `Bearer ${env.PUBLIC_RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'noreply@lgdryer.repair',
      to: 'info@lgdryer.repair',
      subject: payload.type === 'callback' ? '📞 New Callback Request' : '📅 New Booking Request',
      text: text
    })
  });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
