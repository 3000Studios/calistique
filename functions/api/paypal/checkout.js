import catalog from '../../../content/products/catalog.json' with { type: 'json' }

const PAYPAL_API_BASE = 'https://api-m.paypal.com'

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

function getPayPalConfig(env) {
  const clientId = env?.PAYPAL_CLIENT_ID
  const clientSecret = env?.PAYPAL_CLIENT_SECRET
  if (!clientId || !clientSecret || clientId.startsWith('replace-') || clientSecret.startsWith('replace-')) {
    return null
  }
  return { clientId, clientSecret }
}

async function getAccessToken(clientId, clientSecret) {
  const credentials = btoa(`${clientId}:${clientSecret}`)
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    throw new Error('Failed to obtain PayPal access token.')
  }

  const data = await response.json()
  return data.access_token
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

export async function onRequestPost(context) {
  try {
    const config = getPayPalConfig(context.env)
    if (!config) {
      return json(
        {
          ok: false,
          error: 'PayPalNotConfigured',
          message: 'PayPal is not configured for this site yet.',
        },
        { status: 501 }
      )
    }

    const payload = await context.request.json().catch(() => ({}))
    const items = payload?.items ?? []

    if (!Array.isArray(items) || items.length === 0) {
      return json(
        { ok: false, error: 'EmptyCart', message: 'Cart is empty.' },
        { status: 400 }
      )
    }

    const currency = String(catalog?.currency ?? 'usd').toUpperCase()
    const lineItems = []
    let totalCents = 0

    for (const item of items.slice(0, 25)) {
      const slug = String(item?.slug ?? '').trim()
      const variantSku = String(item?.sku ?? '').trim()

      if (!slug || !variantSku) {
        return json(
          { ok: false, error: 'InvalidItem', message: 'Invalid cart item.' },
          { status: 400 }
        )
      }

      const product = getCatalogProduct(slug)
      if (!product) {
        return json(
          { ok: false, error: 'UnknownProduct', message: `Unknown product "${slug}".` },
          { status: 400 }
        )
      }

      const variant = getVariant(product, variantSku)
      if (!variant) {
        return json(
          { ok: false, error: 'UnknownVariant', message: `Unknown variant "${variantSku}".` },
          { status: 400 }
        )
      }

      if (typeof variant.stock === 'number' && variant.stock <= 0) {
        return json(
          { ok: false, error: 'OutOfStock', message: `"${product.name}" is out of stock.` },
          { status: 400 }
        )
      }

      const quantity = normalizeQuantity(item?.quantity)
      const unitCents = variant.priceCents ?? 0
      const lineCents = unitCents * quantity
      totalCents += lineCents

      const unitAmount = (unitCents / 100).toFixed(2)
      const lineTotal = (lineCents / 100).toFixed(2)

      lineItems.push({
        name: `${product.name}${variant.label ? ` — ${variant.label}` : ''}`,
        unit_amount: { currency_code: currency, value: unitAmount },
        quantity: String(quantity),
        item_total: { currency_code: currency, value: lineTotal },
      })
    }

    const totalAmount = (totalCents / 100).toFixed(2)
    const origin = getOrigin(context.request)
    const returnUrl = new URL('/order/success', origin).toString()
    const cancelUrl = new URL('/order/cancel', origin).toString()

    const accessToken = await getAccessToken(config.clientId, config.clientSecret)

    const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': crypto.randomUUID(),
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: totalAmount,
              breakdown: {
                item_total: { currency_code: currency, value: totalAmount },
              },
            },
            items: lineItems,
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
              brand_name: 'Calistique',
              locale: 'en-US',
              landing_page: 'LOGIN',
              shipping_preference: 'GET_FROM_FILE',
              user_action: 'PAY_NOW',
              return_url: returnUrl,
              cancel_url: cancelUrl,
            },
          },
        },
      }),
    })

    if (!orderResponse.ok) {
      const errorBody = await orderResponse.json().catch(() => ({}))
      throw new Error(errorBody?.message ?? 'PayPal order creation failed.')
    }

    const order = await orderResponse.json()
    const approvalLink = order.links?.find((link) => link.rel === 'payer-action')?.href

    if (!approvalLink) {
      throw new Error('No PayPal approval URL returned.')
    }

    return json({
      ok: true,
      checkoutUrl: approvalLink,
      orderId: order.id,
    })
  } catch (error) {
    return json(
      {
        ok: false,
        error: error?.name ?? 'CheckoutError',
        message: error?.message ?? 'PayPal checkout failed.',
      },
      { status: 400 }
    )
  }
}
