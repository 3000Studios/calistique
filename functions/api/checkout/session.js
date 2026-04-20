import Stripe from 'stripe'
import catalog from '../../../content/products/catalog.json' with { type: 'json' }

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

function getOrigin(request) {
  const url = new URL(request.url)
  return `${url.protocol}//${url.host}`
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

function getCatalogProduct(slug) {
  const products = Array.isArray(catalog?.products) ? catalog.products : []
  return products.find((p) => p?.slug === slug) ?? null
}

function getVariant(product, variantSku) {
  const variants = Array.isArray(product?.variants) ? product.variants : []
  return variants.find((v) => v?.sku === variantSku) ?? null
}

function normalizeQuantity(value) {
  const quantity = Number.parseInt(String(value), 10)
  if (!Number.isFinite(quantity) || quantity <= 0) return 1
  return Math.min(quantity, 10)
}

function assertCartItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Cart is empty.')
  }

  if (items.length > 25) {
    throw new Error('Cart has too many items.')
  }
}

function buildLineItem({ product, variant, quantity }) {
  const currency = String(catalog?.currency ?? 'usd').toLowerCase()
  const name = `${product.name}${variant?.label ? ` — ${variant.label}` : ''}`
  const images = Array.isArray(product.images) ? product.images : []

  if (variant?.stripePriceId) {
    return {
      price: variant.stripePriceId,
      quantity,
    }
  }

  if (!variant?.priceCents || variant.priceCents <= 0) {
    throw new Error('Invalid product pricing.')
  }

  return {
    quantity,
    price_data: {
      currency,
      unit_amount: variant.priceCents,
      product_data: {
        name,
        images: images.length ? images.slice(0, 3) : undefined,
        metadata: {
          slug: product.slug,
          sku: variant.sku,
          category: product.category ?? '',
          dropId: product.dropId ?? '',
        },
      },
    },
  }
}

export async function onRequestPost(context) {
  try {
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

    const payload = await context.request.json().catch(() => ({}))
    const items = payload?.items ?? []
    const referralId =
      typeof payload?.referralId === 'string' ? payload.referralId : ''

    assertCartItems(items)

    const lineItems = items.map((item) => {
      const slug = String(item?.slug ?? '').trim()
      const variantSku = String(item?.sku ?? '').trim()

      if (!slug || !variantSku) {
        throw new Error('Invalid cart item.')
      }

      const product = getCatalogProduct(slug)
      if (!product) {
        throw new Error(`Unknown product "${slug}".`)
      }

      const variant = getVariant(product, variantSku)
      if (!variant) {
        throw new Error(`Unknown variant "${variantSku}".`)
      }

      if (typeof variant.stock === 'number' && variant.stock <= 0) {
        throw new Error(`"${product.name}" is out of stock.`)
      }

      return buildLineItem({
        product,
        variant,
        quantity: normalizeQuantity(item?.quantity),
      })
    })

    const origin = getOrigin(context.request)
    const successUrl = new URL('/order/success', origin)
    const cancelUrl = new URL('/order/cancel', origin)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: Array.isArray(catalog?.shipping?.allowedCountries)
          ? catalog.shipping.allowedCountries
          : ['US', 'CA'],
      },
      phone_number_collection: { enabled: true },
      automatic_tax: { enabled: true },
      success_url: `${successUrl.toString()}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cancelUrl.toString()}`,
      metadata: {
        referralId: referralId || undefined,
        orderSource: 'calistique_storefront',
      },
    })

    return json({
      ok: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    return json(
      {
        ok: false,
        error: error?.name ?? 'CheckoutError',
        message: error?.message ?? 'Checkout failed.',
      },
      { status: 400 }
    )
  }
}

export async function onRequestGet(context) {
  try {
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

    const url = new URL(context.request.url)
    const sessionId = url.searchParams.get('session_id') || ''
    if (!sessionId) {
      return json(
        { ok: false, error: 'MissingSession', message: 'Missing session_id.' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    return json({
      ok: true,
      status: session.status,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_details?.email ?? null,
      receiptUrl: session?.receipt_url ?? null,
    })
  } catch (error) {
    return json(
      {
        ok: false,
        error: error?.name ?? 'SessionError',
        message: error?.message ?? 'Failed to fetch session.',
      },
      { status: 400 }
    )
  }
}

