const REQUIRED_NODE_MAJOR = 20

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
      message: `Node.js ${REQUIRED_NODE_MAJOR}+ is required. Current runtime: ${process.version}.`
    }
  }

  return {
    ok: true,
    name: 'node_version',
    message: `Node.js runtime ${process.version} is supported.`
  }
}

function validateCloudflareVariables() {
  const required = ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID']
  const missing = required.filter((name) => !process.env[name])

  return {
    ok: missing.length === 0,
    name: 'cloudflare_env',
    message:
      missing.length === 0
        ? 'Cloudflare deployment variables are present.'
        : `Missing optional deployment variables: ${missing.join(', ')}.`
  }
}

const checks = [validateNodeVersion(), validateCloudflareVariables()]
const blockingFailures = checks.filter((check) => check.name === 'node_version' && !check.ok)

console.log(
  JSON.stringify(
    {
      ok: blockingFailures.length === 0,
      checkedAt: new Date().toISOString(),
      checks
    },
    null,
    2
  )
)

if (blockingFailures.length > 0) {
  process.exitCode = 1
}
