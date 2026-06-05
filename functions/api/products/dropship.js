// CJ Affiliate / dropship product feed integration
// Set CJ_API_KEY and CJ_WEBSITE_ID in Cloudflare Pages secrets to activate
// Sign up at: https://developers.cj.com/

const CJ_API_BASE = 'https://product-search.api.cj.com/v2'

function json(payload, init = {}) {
  return new Response(JSON.stringify(payload, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 's-maxage=3600', ...init.headers },
    ...init,
  })
}

function buildCJParams({ query, category, pageSize = 20, page = 1 }) {
  const params = new URLSearchParams()
  params.set('website-id', '')
  params.set('records-per-page', String(pageSize))
  params.set('page', String(page))
  if (query) params.set('keywords', query)
  if (category) params.set('advertiser-ids', 'joined')
  return params
}

export async function onRequestGet(context) {
  const { env } = context
  const cjApiKey = env?.CJ_API_KEY
  const cjWebsiteId = env?.CJ_WEBSITE_ID

  if (!cjApiKey || !cjWebsiteId) {
    return json({
      ok: false,
      error: 'CJNotConfigured',
      message: 'CJ Affiliate not configured. Set CJ_API_KEY and CJ_WEBSITE_ID in CF Pages secrets.',
      setupUrl: 'https://developers.cj.com/',
    }, { status: 501 })
  }

  const url = new URL(context.request.url)
  const query = url.searchParams.get('q') || 'streetwear jewelry'
  const page = Number(url.searchParams.get('page') || '1')

  try {
    const params = buildCJParams({ query, pageSize: 20, page })
    params.set('website-id', cjWebsiteId)

    const res = await fetch(`${CJ_API_BASE}/product-search?${params.toString()}`, {
      headers: { Authorization: `Bearer ${cjApiKey}`, Accept: 'application/json' },
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return json({ ok: false, error: 'CJApiError', detail: text }, { status: res.status })
    }

    const data = await res.json()
    return json({ ok: true, products: data?.products ?? [], total: data?.['total-matched'] ?? 0 })
  } catch (err) {
    return json({ ok: false, error: err?.message }, { status: 500 })
  }
}
