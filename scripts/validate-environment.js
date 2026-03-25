import './lib/loadEnvironment.js'

const REQUIRED_NODE_MAJOR = 20

function isMissing(name) {
  const value = process.env[name]
  return !value || String(value).startsWith('replace-with-')
}

function parseMajor(version) {
  const major = Number.parseInt(version.replace(/^v/, '').split('.')[0], 10)
  return Number.isFinite(major) ? major : null
}

function validateNodeVersion() {
  const major = parseMajor(process.version)

  if (!major || major < REQUIRED_NODE_MAJOR) {
    return {
      ok: false,
      name: 'node_version',
      message: `Node.js ${REQUIRED_NODE_MAJOR}+ is required. Current runtime: ${process.version}.`,
    }
  }

  return {
    ok: true,
    name: 'node_version',
    message: `Node.js runtime ${process.version} is supported.`,
  }
}

function validateCloudflareVariables() {
  const hasApiToken =
    !isMissing('CLOUDFLARE_API_TOKEN') || !isMissing('CLOUD_FLARE_API_TOKEN')
  const hasAccountId =
    !isMissing('CLOUDFLARE_ACCOUNT_ID') || !isMissing('CLOUD_FLARE_ACCOUNT_ID')
  const missing = []

  if (!hasApiToken) {
    missing.push('CLOUDFLARE_API_TOKEN or CLOUD_FLARE_API_TOKEN')
  }

  if (!hasAccountId) {
    missing.push('CLOUDFLARE_ACCOUNT_ID or CLOUD_FLARE_ACCOUNT_ID')
  }

  if (isMissing('CLOUDFLARE_PAGES_PROJECT_NAME')) {
    missing.push('CLOUDFLARE_PAGES_PROJECT_NAME')
  }

  return {
    ok: missing.length === 0,
    name: 'cloudflare_env',
    message:
      missing.length === 0
        ? 'Cloudflare deployment variables are present.'
        : `Missing optional deployment variables: ${missing.join(', ')}. Add them to .secrets/myappai.local.env or your local environment.`,
  }
}

function validateAdminVariables() {
  const required = ['ADMIN_EMAIL', 'ADMIN_PASSCODE', 'ADMIN_SESSION_SECRET']
  const missing = required.filter(
    (name) =>
      !process.env[name] ||
      String(process.env[name]).startsWith('replace-with-')
  )

  return {
    ok: missing.length === 0,
    name: 'admin_env',
    message:
      missing.length === 0
        ? 'Admin session variables are present.'
        : `Missing admin session variables: ${missing.join(', ')}. Add them to .secrets/myappai.local.env or your local environment.`,
  }
}

function validateSiteVariables() {
  const required = [
    'SITE_URL',
    'WWW_SITE_URL',
    'SITE_ORIGIN',
    'WWW_SITE_ORIGIN',
  ]
  const missing = required.filter(isMissing)

  return {
    ok: missing.length === 0,
    name: 'site_env',
    message:
      missing.length === 0
        ? 'Canonical site URL variables are present.'
        : `Missing site variables: ${missing.join(', ')}. Add them to .secrets/myappai.local.env or your local environment.`,
  }
}

function validateAiVariables() {
  const required = ['OPENAI_MODEL']
  const missing = required.filter(isMissing)

  return {
    ok: missing.length === 0,
    name: 'ai_env',
    message:
      missing.length === 0
        ? 'AI runtime defaults are present.'
        : `Missing recommended AI variables: ${missing.join(', ')}. Add them to .secrets/myappai.local.env or your local environment.`,
  }
}

const checks = [
  validateNodeVersion(),
  validateCloudflareVariables(),
  validateAdminVariables(),
  validateSiteVariables(),
  validateAiVariables(),
]
const blockingFailures = checks.filter(
  (check) => check.name === 'node_version' && !check.ok
)

console.log(
  JSON.stringify(
    {
      ok: blockingFailures.length === 0,
      checkedAt: new Date().toISOString(),
      checks,
    },
    null,
    2
  )
)

if (blockingFailures.length > 0) {
  process.exitCode = 1
}
