import Stripe from 'stripe'

function json(payload, init = {}) {
  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...init.headers,
    },
    ...init,
  })
}

function getStripe(env) {
  const secretKey = env?.STRIPE_SECRET_KEY
  if (!secretKey || String(secretKey).startsWith('replace-with-')) {
    return null
  }

  return new Stripe(secretKey, {
    apiVersion: '2025-01-27.acacia',
  })
}

export async function onRequestPost(context) {
  const stripe = getStripe(context.env)
  if (!stripe) {
    return json(
      {
        ok: false,
        error: 'StripeNotConfigured',
        message: 'Stripe is not configured for this site yet.',
      },
      { status: 501 }
    )
  }

  const webhookSecret = context.env?.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret || String(webhookSecret).startsWith('replace-with-')) {
    return json(
      {
        ok: false,
        error: 'WebhookNotConfigured',
        message: 'Stripe webhook secret is not configured.',
      },
      { status: 501 }
    )
  }

  const signature = context.request.headers.get('stripe-signature')
  if (!signature) {
    return json(
      { ok: false, error: 'MissingSignature', message: 'Missing signature.' },
      { status: 400 }
    )
  }

  const body = await context.request.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    return json(
      {
        ok: false,
        error: 'InvalidSignature',
        message: error?.message ?? 'Invalid signature.',
      },
      { status: 400 }
    )
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data?.object
    console.log('stripe.checkout.session.completed', {
      id: session?.id,
      amount_total: session?.amount_total,
      currency: session?.currency,
      email: session?.customer_details?.email,
      metadata: session?.metadata,
      payment_intent: session?.payment_intent,
    })
  }

  return json({ ok: true })
}

