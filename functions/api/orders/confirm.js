// Called by Stripe webhook after payment — sends order confirmation email via Resend
function json(payload, init = {}) {
  return new Response(JSON.stringify(payload, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...init.headers },
    ...init,
  })
}

export async function onRequestPost(context) {
  const { env } = context
  const resendKey = env?.RESEND_API_KEY
  if (!resendKey) {
    return json({ ok: false, error: 'ResendNotConfigured' }, { status: 501 })
  }

  let body = {}
  try {
    body = await context.request.json()
  } catch {
    return json({ ok: false, error: 'InvalidBody' }, { status: 400 })
  }

  const { customerEmail, amountTotal, currency, sessionId } = body
  if (!customerEmail || !sessionId) {
    return json({ ok: false, error: 'MissingFields' }, { status: 400 })
  }

  const amount = typeof amountTotal === 'number'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: currency ?? 'usd', maximumFractionDigits: 0 }).format(amountTotal / 100)
    : ''

  const emailBody = {
    from: 'Calistique <orders@calistique.xyz>',
    to: [customerEmail],
    subject: 'Your Calistique order is confirmed',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0a0a0a;color:#f5f5f5;padding:40px 32px;border-radius:8px">
        <p style="letter-spacing:.15em;font-size:11px;color:#888;text-transform:uppercase;margin:0 0 24px">Calistique · Est. MMXXVI</p>
        <h1 style="font-size:28px;font-weight:700;margin:0 0 8px">Order confirmed.</h1>
        <p style="color:#aaa;margin:0 0 32px">Your payment was received. We're packing your order now.</p>
        ${amount ? `<p style="font-size:18px;font-weight:600;margin:0 0 24px">Total: ${amount}</p>` : ''}
        <p style="color:#aaa;font-size:13px;margin:0 0 8px">Questions? Reply to this email or contact <a href="mailto:hello@calistique.xyz" style="color:#c9a96e">hello@calistique.xyz</a></p>
        <p style="color:#555;font-size:11px;margin:32px 0 0">Calistique.xyz · Luxury Streetwear &amp; Fine Jewellery</p>
      </div>
    `,
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(emailBody),
    })
    const result = await res.json().catch(() => ({}))
    if (!res.ok) {
      return json({ ok: false, error: 'ResendError', detail: result }, { status: 502 })
    }
    return json({ ok: true, emailId: result?.id })
  } catch (err) {
    return json({ ok: false, error: err?.message }, { status: 500 })
  }
}
