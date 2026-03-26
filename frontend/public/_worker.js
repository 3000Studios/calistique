const SESSION_COOKIE = 'myappai_admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 12
const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
}
const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

function jsonResponse(payload, status = 200, headers = {}) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      ...JSON_HEADERS,
      ...headers,
    },
  })
}

function toBase64Url(value) {
  const bytes =
    typeof value === 'string'
      ? textEncoder.encode(value)
      : new Uint8Array(value)
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function fromBase64Url(value) {
  const normalized = String(value)
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(value.length / 4) * 4, '=')

  const binary = atob(normalized)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

async function importSigningKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
}

async function signValue(value, secret) {
  const key = await importSigningKey(secret)
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    textEncoder.encode(value)
  )

  return toBase64Url(signature)
}

async function verifySignedValue(value, signature, secret) {
  const expected = await signValue(value, secret)
  return signature === expected
}

function parseCookies(request) {
  const header = request.headers.get('cookie') ?? ''

  return Object.fromEntries(
    header
      .split(';')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const [key, ...rest] = entry.split('=')
        return [key, rest.join('=')]
      })
  )
}

function createSetCookie(value, maxAge) {
  const parts = [
    `${SESSION_COOKIE}=${value}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    'Secure',
    `Max-Age=${maxAge}`,
  ]

  return parts.join('; ')
}

function getAdminEmail(env) {
  return String(env.ADMIN_EMAIL ?? '')
    .trim()
    .toLowerCase()
}

function getAdminPasscode(env) {
  return String(env.ADMIN_PASSCODE ?? '5555').trim()
}

function getAdminApiKey(env) {
  return String(env.ADMIN_API_KEY ?? env.X_ADMIN_KEY ?? '').trim()
}

function getSessionSecret(env) {
  return String(env.ADMIN_SESSION_SECRET ?? '').trim()
}

function getSecureLogsCode(env) {
  return String(env.LOGS_ACCESS_CODE ?? '8888').trim()
}

async function createSignedSession(email, env) {
  const secret = getSessionSecret(env)

  if (!secret) {
    throw new Error(
      'ADMIN_SESSION_SECRET must be configured to enable admin login.'
    )
  }

  const payload = {
    email,
    authMode: 'session',
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  }
  const encodedPayload = toBase64Url(JSON.stringify(payload))
  const signature = await signValue(encodedPayload, secret)

  return `${encodedPayload}.${signature}`
}

async function readSignedSession(request, env) {
  const secret = getSessionSecret(env)

  if (!secret) {
    return null
  }

  const cookies = parseCookies(request)
  const signedToken = cookies[SESSION_COOKIE]

  if (!signedToken) {
    return null
  }

  const [encodedPayload, signature] = signedToken.split('.')

  if (!encodedPayload || !signature) {
    return null
  }

  const valid = await verifySignedValue(encodedPayload, signature, secret)

  if (!valid) {
    return null
  }

  try {
    const payload = JSON.parse(
      textDecoder.decode(fromBase64Url(encodedPayload))
    )

    if (!payload?.email || !payload?.exp) {
      return null
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      return null
    }

    return {
      email: String(payload.email).trim().toLowerCase(),
      authMode: payload.authMode ?? 'session',
    }
  } catch {
    return null
  }
}

function validateInlineAdminAuth(request, env) {
  const configuredEmail = getAdminEmail(env)
  const configuredCode = getAdminPasscode(env)
  const configuredKey = getAdminApiKey(env)
  const adminKey = String(request.headers.get('x-admin-key') ?? '').trim()
  const email = String(request.headers.get('x-admin-email') ?? '')
    .trim()
    .toLowerCase()
  const code = String(request.headers.get('x-admin-code') ?? '').trim()

  if (configuredKey && adminKey && configuredKey === adminKey) {
    return {
      ok: true,
      email: configuredEmail || 'api-key-admin',
      authMode: 'api-key',
    }
  }

  if (!configuredEmail || !configuredCode) {
    return {
      ok: false,
      message:
        'ADMIN_EMAIL and ADMIN_PASSCODE must be configured before admin login can be used.',
    }
  }

  if (email !== configuredEmail || code !== configuredCode) {
    return {
      ok: false,
      message: 'Valid admin credentials are required.',
    }
  }

  return {
    ok: true,
    email: configuredEmail,
    authMode: 'email-passcode',
  }
}

async function requireAdmin(request, env) {
  const session = await readSignedSession(request, env)

  if (session) {
    return { ok: true, admin: session }
  }

  const fallback = validateInlineAdminAuth(request, env)

  if (!fallback.ok) {
    return {
      ok: false,
      response: jsonResponse(
        {
          error: 'Admin access required',
          message: fallback.message,
        },
        403
      ),
    }
  }

  return {
    ok: true,
    admin: {
      email: fallback.email,
      authMode: fallback.authMode,
    },
  }
}

function buildAnalyticsSnapshot() {
  return {
    visitors: 0,
    pageViews: 0,
    leads: 0,
    purchases: 0,
    conversionRate: 0,
    revenue: 0,
    dataSources: {
      visitors: 'edge-fallback',
      leads: 'edge-fallback',
      revenue: 'edge-fallback',
    },
    models: [],
    traffic: {
      queuedTopics: 0,
      publishedPages: 0,
    },
    aiActivity: {
      commandsToday: 0,
      deploymentsToday: 0,
      lastAction: 'idle',
    },
    contentCounts: {
      pages: 0,
      blog: 0,
      products: 0,
      system: 0,
    },
  }
}

function buildPublicSiteSnapshot(env) {
  return {
    analytics: buildAnalyticsSnapshot(),
    brand: {
      displayName: env.APP_NAME ?? 'MyAppAI',
      url: env.SITE_URL ?? 'https://myappai.net',
      category: 'AI operator platform for research, code, and deployment',
    },
    proof: {
      liveDataOnly: false,
      leadCaptureReady: true,
      adminSurfaceReady: true,
      trafficEngineReady: false,
      contentCounts: {
        pages: 0,
        blog: 0,
        products: 0,
        system: 0,
      },
      modelsOnline: 0,
      latestDeployment: null,
    },
    funnel: {
      mode: 'operator_login',
      contactMode: 'lead_form',
      contactPath: '/admin/login',
      primaryOfferSlug: null,
      implementationOfferSlug: null,
      enterpriseOfferSlug: null,
      offers: [],
    },
  }
}

function buildDeploymentsSnapshot() {
  return {
    history: [
      {
        id: `edge-${Date.now()}`,
        status: 'live',
        branch: 'main',
        message: 'Pages edge API is active on myappai.net.',
        finishedAt: new Date().toISOString(),
      },
    ],
    commits: [],
  }
}

function buildRevenueSnapshot() {
  return {
    leads: [],
    payments: [],
    totals: {
      openLeads: 0,
      completedPayments: 0,
      revenue: 0,
    },
  }
}

function buildLogsSnapshot(scope = 'operator') {
  return {
    entries: [
      {
        id: `${scope}-${Date.now()}`,
        level: 'info',
        scope,
        title: 'Pages edge API active',
        message:
          'This Pages deployment is serving API traffic from the edge fallback runtime.',
        createdAt: new Date().toISOString(),
      },
    ],
  }
}

function buildMetricsSnapshot() {
  return {
    tasks: 0,
    cpu: 0,
    memory: 0,
    deploymentsToday: 0,
  }
}

function getCommandUnavailableReason(request, env) {
  const origin = String(env.ADMIN_API_ORIGIN ?? '').trim()

  if (!origin) {
    return 'Set ADMIN_API_ORIGIN to an external repo-backed operator API.'
  }

  try {
    const requestOrigin = new URL(request.url).origin
    const adminOrigin = new URL(origin).origin

    if (adminOrigin === requestOrigin) {
      return 'ADMIN_API_ORIGIN points back to this Pages site. It must point to an external repo-backed operator API.'
    }
  } catch {
    return 'ADMIN_API_ORIGIN is not a valid URL.'
  }

  return 'The configured ADMIN_API_ORIGIN is not proxying this deployment to a repo-backed operator API.'
}

function buildUnavailableCommandResponse(request, env) {
  return {
    status: 'unavailable',
    mode: 'edge-fallback',
    summary:
      'Live operator actions need a repo-backed runtime before they can edit files or deploy.',
    unavailableReason: getCommandUnavailableReason(request, env),
    nextSteps: [
      'Keep using myappai.net for sign-in and dashboard access.',
      'Point ADMIN_API_ORIGIN to an external repo-backed operator API for file edits and deploy actions.',
    ],
    deployment: null,
    affectedPaths: [],
    sources: [],
  }
}

function isProxyableOrigin(request, env) {
  const origin = String(env.ADMIN_API_ORIGIN ?? '').trim()

  if (!origin) {
    return false
  }

  try {
    const requestOrigin = new URL(request.url).origin
    return new URL(origin).origin !== requestOrigin
  } catch {
    return false
  }
}

function proxyToAdmin(request, env) {
  const incomingUrl = new URL(request.url)
  const targetUrl = new URL(
    `${incomingUrl.pathname}${incomingUrl.search}`,
    env.ADMIN_API_ORIGIN
  )

  return fetch(
    new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'follow',
    })
  )
}

async function handleAdminLogin(request, env) {
  const body = await request.json().catch(() => ({}))
  const configuredEmail = getAdminEmail(env)
  const configuredCode = getAdminPasscode(env)
  const configuredKey = getAdminApiKey(env)
  const email = String(body.email ?? '')
    .trim()
    .toLowerCase()
  const code = String(body.code ?? '').trim()
  const adminKey = String(body.adminKey ?? '').trim()

  if (configuredKey && adminKey && adminKey === configuredKey) {
    const signedSession = await createSignedSession(
      configuredEmail || 'api-key-admin',
      env
    )

    return jsonResponse(
      {
        ok: true,
        adminEmail: configuredEmail || 'api-key-admin',
        authMode: 'api-key',
      },
      200,
      {
        'set-cookie': createSetCookie(signedSession, SESSION_TTL_SECONDS),
      }
    )
  }

  if (!configuredEmail || !configuredCode) {
    return jsonResponse(
      {
        ok: false,
        message:
          'ADMIN_EMAIL and ADMIN_PASSCODE must be configured before admin login can be used.',
      },
      500
    )
  }

  if (email !== configuredEmail || code !== configuredCode) {
    return jsonResponse(
      {
        ok: false,
        message: 'Valid admin credentials are required.',
      },
      403
    )
  }

  const signedSession = await createSignedSession(configuredEmail, env)

  return jsonResponse(
    {
      ok: true,
      adminEmail: configuredEmail,
      authMode: 'email-passcode',
    },
    200,
    {
      'set-cookie': createSetCookie(signedSession, SESSION_TTL_SECONDS),
    }
  )
}

async function handleAdminSession(request, env) {
  const auth = await requireAdmin(request, env)

  if (!auth.ok) {
    return auth.response
  }

  return jsonResponse({
    ok: true,
    adminEmail: auth.admin.email,
    authMode: auth.admin.authMode,
  })
}

function handleAdminLogout() {
  return jsonResponse(
    {
      ok: true,
    },
    200,
    {
      'set-cookie': createSetCookie('', 0),
    }
  )
}

async function handleApi(request, env) {
  if (isProxyableOrigin(request, env)) {
    return proxyToAdmin(request, env)
  }

  const url = new URL(request.url)
  const { pathname } = url

  if (pathname === '/api/health') {
    const proxied = isProxyableOrigin(request, env)
    return jsonResponse({
      status: 'ok',
      app: env.APP_NAME ?? 'myappai',
      mode: proxied ? 'repo-proxy' : 'pages-edge-fallback',
    })
  }

  if (pathname === '/api/public/site' && request.method === 'GET') {
    return jsonResponse(buildPublicSiteSnapshot(env))
  }

  if (pathname === '/api/public/events' && request.method === 'POST') {
    return jsonResponse({ ok: true, stored: false, mode: 'edge-fallback' })
  }

  if (pathname === '/api/public/leads' && request.method === 'POST') {
    const lead = await request.json().catch(() => ({}))

    return jsonResponse(
      {
        ok: true,
        lead: {
          id: `lead-${Date.now()}`,
          ...lead,
          status: 'new',
          createdAt: new Date().toISOString(),
        },
      },
      201
    )
  }

  if (pathname === '/api/admin/login' && request.method === 'POST') {
    return handleAdminLogin(request, env)
  }

  if (pathname === '/api/admin/session' && request.method === 'GET') {
    return handleAdminSession(request, env)
  }

  if (pathname === '/api/admin/logout' && request.method === 'POST') {
    return handleAdminLogout()
  }

  const auth = await requireAdmin(request, env)

  if (!auth.ok) {
    return auth.response
  }

  if (pathname === '/api/analytics' && request.method === 'GET') {
    return jsonResponse(buildAnalyticsSnapshot())
  }

  if (pathname === '/api/deployments' && request.method === 'GET') {
    return jsonResponse(buildDeploymentsSnapshot())
  }

  if (pathname === '/api/content' && request.method === 'GET') {
    return jsonResponse({})
  }

  if (pathname === '/api/metrics' && request.method === 'GET') {
    return jsonResponse(buildMetricsSnapshot())
  }

  if (pathname === '/api/logs' && request.method === 'GET') {
    return jsonResponse(buildLogsSnapshot('operator'))
  }

  if (pathname === '/api/logs/client' && request.method === 'POST') {
    return jsonResponse({ ok: true })
  }

  if (pathname === '/api/logs/secure' && request.method === 'GET') {
    if (url.searchParams.get('code') !== getSecureLogsCode(env)) {
      return jsonResponse(
        {
          ok: false,
          message: 'Valid secure logs code required.',
        },
        403
      )
    }

    return jsonResponse(buildLogsSnapshot('secure'))
  }

  if (pathname === '/api/heal' && request.method === 'POST') {
    return jsonResponse({
      ok: true,
      result: {
        status: 'idle',
        warnings: [],
      },
    })
  }

  if (pathname === '/api/revenue' && request.method === 'GET') {
    return jsonResponse(buildRevenueSnapshot())
  }

  if (
    pathname.startsWith('/api/revenue/leads/') &&
    request.method === 'PATCH'
  ) {
    const leadId = pathname.split('/').pop() ?? ''
    const patch = await request.json().catch(() => ({}))

    return jsonResponse({
      ok: true,
      lead: {
        id: decodeURIComponent(leadId),
        ...patch,
        updatedAt: new Date().toISOString(),
      },
    })
  }

  if (pathname === '/api/command' && request.method === 'POST') {
    return jsonResponse(buildUnavailableCommandResponse(request, env))
  }

  return jsonResponse(
    {
      ok: false,
      message: 'API route not implemented in the Pages edge fallback.',
    },
    404
  )
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/')) {
      return handleApi(request, env)
    }

    return env.ASSETS.fetch(request)
  },
}
