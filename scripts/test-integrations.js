import './lib/loadEnvironment.js'

const results = []

async function testOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return {
      name: 'openai',
      ok: false,
      skipped: true,
      message: 'Missing OPENAI_API_KEY.',
    }
  }

  const response = await fetch('https://api.openai.com/v1/models', {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (!response.ok) {
    return { name: 'openai', ok: false, message: `HTTP ${response.status}` }
  }

  const payload = await response.json()
  return {
    name: 'openai',
    ok: true,
    message: `Authenticated. Models visible: ${Array.isArray(payload.data) ? payload.data.length : 0}.`,
  }
}

async function testGitHub() {
  const token = process.env.GH_TOKEN || process.env.GH_PAT
  if (!token) {
    return {
      name: 'github',
      ok: false,
      skipped: true,
      message: 'Missing GH_TOKEN/GH_PAT.',
    }
  }

  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'myappai-secrets-test',
    },
  })

  if (!response.ok) {
    return { name: 'github', ok: false, message: `HTTP ${response.status}` }
  }

  const payload = await response.json()
  return {
    name: 'github',
    ok: true,
    message: `Authenticated as ${payload.login ?? 'unknown'}.`,
  }
}

async function testCloudflare() {
  const token = process.env.CLOUDFLARE_API_TOKEN
  if (!token) {
    return {
      name: 'cloudflare',
      ok: false,
      skipped: true,
      message: 'Missing CLOUDFLARE_API_TOKEN.',
    }
  }

  const response = await fetch(
    'https://api.cloudflare.com/client/v4/user/tokens/verify',
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )

  if (!response.ok) {
    return { name: 'cloudflare', ok: false, message: `HTTP ${response.status}` }
  }

  const payload = await response.json()
  return {
    name: 'cloudflare',
    ok: Boolean(payload.success),
    message: payload.success
      ? 'Token verified.'
      : (payload.errors?.[0]?.message ?? 'Verification failed.'),
  }
}

async function testStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    return {
      name: 'stripe',
      ok: false,
      skipped: true,
      message: 'Missing STRIPE_SECRET_KEY.',
    }
  }

  const response = await fetch('https://api.stripe.com/v1/account', {
    headers: { Authorization: `Bearer ${key}` },
  })

  if (!response.ok) {
    return { name: 'stripe', ok: false, message: `HTTP ${response.status}` }
  }

  const payload = await response.json()
  return {
    name: 'stripe',
    ok: true,
    message: `Authenticated. Account country: ${payload.country ?? 'unknown'}.`,
  }
}

async function testPayPal() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return {
      name: 'paypal',
      ok: false,
      skipped: true,
      message: 'Missing PayPal credentials.',
    }
  }

  const isLive =
    String(process.env.PAYPAL_ENV ?? 'sandbox').toLowerCase() === 'live'
  const baseUrl = isLive
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    return { name: 'paypal', ok: false, message: `HTTP ${response.status}` }
  }

  const payload = await response.json()
  return {
    name: 'paypal',
    ok: true,
    message: `Authenticated. Scope length: ${String(payload.scope ?? '').length}.`,
  }
}

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return {
      name: 'gemini',
      ok: false,
      skipped: true,
      message: 'Missing GEMINI_API_KEY.',
    }
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`
  )

  if (!response.ok) {
    return { name: 'gemini', ok: false, message: `HTTP ${response.status}` }
  }

  const payload = await response.json()
  return {
    name: 'gemini',
    ok: true,
    message: `Authenticated. Models visible: ${Array.isArray(payload.models) ? payload.models.length : 0}.`,
  }
}

async function runTest(fn) {
  try {
    results.push(await fn())
  } catch (error) {
    results.push({
      name: fn.name.replace(/^test/, '').toLowerCase(),
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    })
  }
}

await runTest(testOpenAI)
await runTest(testGitHub)
await runTest(testCloudflare)
await runTest(testStripe)
await runTest(testPayPal)
await runTest(testGemini)

console.log(
  JSON.stringify(
    {
      ok: results.every((result) => result.ok || result.skipped),
      checkedAt: new Date().toISOString(),
      results,
    },
    null,
    2
  )
)
