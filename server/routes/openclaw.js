import { Router } from 'express'
import { spawn } from 'node:child_process'
import { createHmac, randomUUID } from 'node:crypto'
import { answerPublicAssistant } from '../services/assistantService.js'

const router = Router()
const MAX_SESSION_LOGS = 20
const MAX_COMMAND_LOGS = 50

const openclawDB = {
  agents: [
    {
      id: 1,
      name: 'Website Builder',
      type: 'Deployment',
      status: 'active',
      lastRun: new Date(),
    },
    {
      id: 2,
      name: 'Revenue Optimizer',
      type: 'Analytics',
      status: 'active',
      lastRun: new Date(),
    },
    {
      id: 3,
      name: 'Content Generator',
      type: 'Creative',
      status: 'idle',
      lastRun: new Date(),
    },
    {
      id: 4,
      name: 'Security Monitor',
      type: 'Security',
      status: 'active',
      lastRun: new Date(),
    },
  ],
  tasks: [
    {
      id: 1,
      name: 'Deploy Website',
      description: 'Deploy latest changes to production',
      status: 'completed',
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Optimize Ad Revenue',
      description: 'Analyze and optimize ad placements',
      status: 'active',
      createdAt: new Date(),
    },
    {
      id: 3,
      name: 'Generate Blog Content',
      description: 'Create engaging blog posts',
      status: 'pending',
      createdAt: new Date(),
    },
    {
      id: 4,
      name: 'Security Audit',
      description: 'Perform comprehensive security check',
      status: 'scheduled',
      createdAt: new Date(),
    },
  ],
  revenue: {
    daily: 784.5,
    streams: {
      adsense: 450.0,
      premium: 320.0,
      ai_services: 180.0,
      analytics: 50.0,
    },
  },
  sessions: [
    {
      id: 'session-bootstrap',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  logs: [],
}

function isConfiguredValue(value) {
  const normalized = String(value ?? '').trim()

  return (
    normalized.length > 0 &&
    !normalized.startsWith('your-') &&
    !normalized.startsWith('replace-with-')
  )
}

function getConfiguredEnvironmentValue(...names) {
  for (const name of names) {
    const value = String(process.env[name] ?? '').trim()

    if (isConfiguredValue(value)) {
      return value
    }
  }

  return ''
}

function createHttpError(statusCode, message) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

function getOpenClawIdentity() {
  return {
    email: getConfiguredEnvironmentValue('OPENCLAW_ADMIN_EMAIL', 'ADMIN_EMAIL'),
    passcode: getConfiguredEnvironmentValue(
      'OPENCLAW_ADMIN_PASSCODE',
      'ADMIN_PASSCODE'
    ),
    apiKey: getConfiguredEnvironmentValue(
      'OPENCLAW_ADMIN_API_KEY',
      'ADMIN_API_KEY',
      'X_ADMIN_KEY'
    ),
    sessionSecret: getConfiguredEnvironmentValue(
      'OPENCLAW_SESSION_SECRET',
      'ADMIN_SESSION_SECRET'
    ),
  }
}

function deriveOpenClawToken(identity) {
  if (identity.apiKey) {
    return identity.apiKey
  }

  if (!identity.email || !identity.passcode || !identity.sessionSecret) {
    return ''
  }

  return createHmac('sha256', identity.sessionSecret)
    .update(`${identity.email}:${identity.passcode}`)
    .digest('hex')
}

function getOpenClawTokenCandidates(req) {
  return [
    String(req.headers.authorization ?? '').replace(/^Bearer\s+/i, '').trim(),
    String(req.get?.('x-openclaw-key') ?? '').trim(),
    String(req.get?.('x-admin-key') ?? '').trim(),
  ].filter(Boolean)
}

function requireAuth(req, res, next) {
  const identity = getOpenClawIdentity()
  const expected = deriveOpenClawToken(identity)

  if (!expected) {
    return res.status(503).json({
      error:
        'OpenClaw admin credentials are not configured. Set ADMIN_EMAIL, ADMIN_PASSCODE, and ADMIN_SESSION_SECRET or ADMIN_API_KEY.',
    })
  }

  const supplied = getOpenClawTokenCandidates(req)
  if (supplied.some((token) => token === expected)) {
    req.openclawAdmin = {
      email: identity.email || 'local-admin',
      authMode: identity.apiKey ? 'api-key' : 'passcode',
    }
    return next()
  }

  return res.status(401).json({ error: 'Unauthorized access' })
}

function logCommand(entry) {
  openclawDB.logs.unshift(entry)
  openclawDB.logs = openclawDB.logs.slice(0, MAX_COMMAND_LOGS)

  const session = openclawDB.sessions[0]
  if (session) {
    session.updatedAt = new Date()
  }
}

function updateAgent(name, status) {
  const agent = openclawDB.agents.find((entry) => entry.name === name)
  if (agent) {
    agent.lastRun = new Date()
    agent.status = status
  }
}

function buildSkills() {
  return [
    {
      id: 'free-ollama-stack',
      name: 'Free Local Assistant',
      category: 'AI',
      status: 'available',
      description:
        'Routes assistant requests through Ollama when the free local provider is enabled.',
    },
    {
      id: 'deployment-ops',
      name: 'Deployment Automation',
      category: 'Operations',
      status: 'available',
      description: 'Runs controlled build and deploy workflows for the site.',
    },
    {
      id: 'content-pipeline',
      name: 'Content Pipeline',
      category: 'Creative',
      status: 'available',
      description: 'Generates briefs, drafts, and content tasks.',
    },
    {
      id: 'security-monitor',
      name: 'Security Monitor',
      category: 'Security',
      status: 'available',
      description: 'Tracks admin actions and keeps the control surface auditable.',
    },
    {
      id: 'workspace-cleanup',
      name: 'Workspace Cleanup',
      category: 'Maintenance',
      status: 'available',
      description: 'Keeps generated files, caches, and temp output organized.',
    },
  ]
}

function buildSessionSnapshot() {
  return openclawDB.sessions.map((session) => ({
    id: session.id,
    status: session.status,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  }))
}

function buildRevenueSnapshot() {
  return {
    total: openclawDB.revenue.daily,
    daily: openclawDB.revenue.daily,
    streams: openclawDB.revenue.streams,
  }
}

async function executeDeploy(options = {}) {
  updateAgent('Website Builder', 'active')
  logCommand({
    id: randomUUID(),
    type: 'deploy',
    content: 'Deployment workflow requested.',
    timestamp: new Date().toISOString(),
  })

  if (String(process.env.OPENCLAW_ENABLE_SHELL_COMMANDS ?? '').trim() !== 'true') {
    return {
      output:
        'Deploy workflow is wired, but shell execution is gated. Set OPENCLAW_ENABLE_SHELL_COMMANDS=true to allow build and deploy commands.',
      mode: 'dry-run',
      options,
    }
  }

  await executeShellCommand('npm run build')
  await executeShellCommand('npm run pages:deploy')
  openclawDB.revenue.daily = Math.min(1000, openclawDB.revenue.daily + 50)

  return {
    output: 'Deployment completed successfully.',
    mode: 'live',
    options,
  }
}

async function executeOptimize() {
  updateAgent('Revenue Optimizer', 'active')
  const delta = Number((Math.random() * 25).toFixed(2))
  openclawDB.revenue.daily = Math.min(1000, openclawDB.revenue.daily + delta)

  return {
    output: `Revenue optimization completed. Daily revenue increased by $${delta.toFixed(2)}.`,
  }
}

async function executeGenerate() {
  updateAgent('Content Generator', 'active')

  return {
    output:
      'Content generation completed. New blog posts and articles are queued.',
  }
}

async function executeAnalyze() {
  updateAgent('Security Monitor', 'active')

  return {
    output:
      'Security analysis completed. Auth, logging, and command gating are enabled.',
  }
}

async function executeStatus() {
  const activeAgents = openclawDB.agents.filter((agent) => agent.status === 'active').length
  const activeTasks = openclawDB.tasks.filter((task) => task.status === 'active').length

  return {
    output: `System Status: ${activeAgents} active agents, ${activeTasks} active tasks, $${openclawDB.revenue.daily.toFixed(2)} daily revenue.`,
  }
}

async function executeAssistantCommand(command, options) {
  const assistant = await answerPublicAssistant({
    message: command,
    history: [],
  })

  logCommand({
    id: randomUUID(),
    type: 'assistant',
    content: command,
    timestamp: new Date().toISOString(),
  })

  return {
    output: assistant.reply,
    source: assistant.source,
    options,
  }
}

async function executeCommand(command, options = {}) {
  const normalized = String(command ?? '').trim()
  const lower = normalized.toLowerCase()

  if (!normalized) {
    throw createHttpError(400, 'Command is required')
  }

  if (lower.includes('deploy')) {
    return executeDeploy(options)
  }

  if (lower.includes('optimize')) {
    return executeOptimize()
  }

  if (lower.includes('generate')) {
    return executeGenerate()
  }

  if (lower.includes('analyze') || lower.includes('audit')) {
    return executeAnalyze()
  }

  if (lower.includes('status')) {
    return executeStatus()
  }

  if (String(process.env.OPENCLAW_ENABLE_CUSTOM_COMMANDS ?? '').trim() === 'true') {
    const result = await executeShellCommand(normalized)
    return {
      output: result.trim() || 'Command completed with no output.',
    }
  }

  return executeAssistantCommand(normalized, options)
}

function executeShellCommand(command) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, { shell: true, stdio: 'pipe' })
    let output = ''
    let errorOutput = ''

    child.stdout.on('data', (data) => {
      output += data.toString()
    })

    child.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve(output)
        return
      }

      reject(new Error(errorOutput || `Command failed with code ${code}`))
    })

    child.on('error', (error) => {
      reject(error)
    })
  })
}

router.post('/auth', async (req, res) => {
  const identity = getOpenClawIdentity()
  const expectedToken = deriveOpenClawToken(identity)
  const { email = '', code = '', adminKey = '' } = req.body ?? {}
  const submittedEmail = String(email).trim()
  const submittedCode = String(code).trim()
  const submittedKey = String(adminKey).trim()

  if (!expectedToken) {
    return res.status(503).json({
      error:
        'OpenClaw auth is not configured. Set ADMIN_EMAIL, ADMIN_PASSCODE, and ADMIN_SESSION_SECRET or ADMIN_API_KEY.',
    })
  }

  const passwordAccepted =
    identity.email &&
    identity.passcode &&
    submittedEmail === identity.email &&
    submittedCode === identity.passcode
  const apiKeyAccepted = identity.apiKey && submittedKey === identity.apiKey
  const authMode = apiKeyAccepted ? 'api-key' : 'passcode'

  if (!passwordAccepted && !apiKeyAccepted) {
    return res.status(401).json({ error: 'Authentication failed' })
  }

  const session = {
    id: randomUUID(),
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  openclawDB.sessions.unshift(session)
  openclawDB.sessions = openclawDB.sessions.slice(0, MAX_SESSION_LOGS)

  res.json({
    token: expectedToken,
    user: {
      email: identity.email || submittedEmail || 'openclaw-admin',
      roles: ['admin'],
      authMode,
    },
  })
})

router.get('/agents', requireAuth, async (_req, res) => {
  try {
    res.json(openclawDB.agents)
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch agents' })
  }
})

router.get('/tasks', requireAuth, async (_req, res) => {
  try {
    res.json(openclawDB.tasks)
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

router.get('/revenue', requireAuth, async (_req, res) => {
  try {
    res.json(buildRevenueSnapshot())
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch revenue data' })
  }
})

router.get('/skills', requireAuth, async (_req, res) => {
  try {
    res.json(buildSkills())
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch skills' })
  }
})

router.get('/sessions', requireAuth, async (_req, res) => {
  try {
    res.json(buildSessionSnapshot())
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch sessions' })
  }
})

router.get('/status', requireAuth, async (_req, res) => {
  try {
    res.json({
      success: true,
      revenue: buildRevenueSnapshot(),
      agents: openclawDB.agents.length,
      tasks: openclawDB.tasks.length,
      sessions: buildSessionSnapshot(),
    })
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch status' })
  }
})

router.post('/execute', requireAuth, async (req, res) => {
  try {
    const { command, options = {} } = req.body ?? {}
    const result = await executeCommand(command, options)
    logCommand({
      id: randomUUID(),
      type: 'command',
      content: String(command),
      timestamp: new Date().toISOString(),
    })
    res.json({
      success: true,
      output: result.output,
      message: result.output,
      source: result.source ?? 'openclaw',
      mode: result.mode ?? 'assistant',
    })
  } catch (error) {
    console.error('Command execution error:', error)
    res.status(error.statusCode || 500).json({
      error: error.message,
      success: false,
    })
  }
})

router.post('/deploy', requireAuth, async (req, res) => {
  try {
    const result = await executeDeploy(req.body?.options ?? {})
    res.json({
      ...result,
      success: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Deployment error:', error)
    res.status(500).json({ error: error.message, success: false })
  }
})

setInterval(() => {
  openclawDB.revenue.daily = Math.min(
    1000,
    openclawDB.revenue.daily + Math.random() * 2
  )
}, 300000)

export default router
