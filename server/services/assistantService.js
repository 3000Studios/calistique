import OpenAI from 'openai'
import { getAnalyticsSnapshot } from './analyticsService.js'
import { getCommerceSnapshot } from './commerceService.js'
import { getDeploymentHistory } from './deploymentService.js'
import { SITE_DISPLAY_NAME } from '../../frontend/src/siteMeta.js'

function hasOpenAiKey() {
  const apiKey = String(process.env.OPENAI_API_KEY ?? '').trim()
  return (
    apiKey.length > 0 &&
    !apiKey.startsWith('your-') &&
    !apiKey.startsWith('replace-with-')
  )
}

function normalizeHistory(history) {
  return Array.isArray(history)
    ? history
        .filter(
          (entry) =>
            entry &&
            (entry.role === 'user' || entry.role === 'assistant') &&
            typeof entry.content === 'string'
        )
        .slice(-6)
        .map((entry) => ({
          role: entry.role,
          content: entry.content.slice(0, 1500),
        }))
    : []
}

function buildContext(analytics, commerce, deployments) {
  const latestDeployment = deployments.history?.[0] ?? null
  const configuredProviders = Object.entries(commerce.providers ?? {})
    .filter(([, enabled]) => enabled)
    .map(([provider]) => provider)

  return {
    analytics,
    commerce,
    deployment: latestDeployment
      ? {
          status: latestDeployment.status,
          message: latestDeployment.message,
          finishedAt: latestDeployment.finishedAt ?? latestDeployment.startedAt,
        }
      : null,
    configuredProviders,
  }
}

function withSource(payload, source) {
  return {
    ...payload,
    source,
  }
}

function buildFallbackResponse(message, context) {
  const lowerMessage = message.toLowerCase()
  const providerList = context.configuredProviders.length
    ? context.configuredProviders.join(' + ')
    : 'inquiry-first only'
  const latestDeployment = context.deployment
    ? `${context.deployment.status} on ${new Date(context.deployment.finishedAt).toLocaleString()}`
    : 'No deployment has been recorded yet.'

  if (
    lowerMessage.includes('price') ||
    lowerMessage.includes('plan') ||
    lowerMessage.includes('buy')
  ) {
    return withSource(
      {
        reply: `${SITE_DISPLAY_NAME} has three main paths: Season Pass for direct booking, Family Adventure Weekend for guided planning, and Group Retreat Planning for custom group experiences. Active payment routing is ${providerList}.`,
        suggestions: [
          { label: 'Open pricing', href: '/pricing' },
          { label: 'View products', href: '/products' },
        ],
      },
      'fallback'
    )
  }

  if (
    lowerMessage.includes('deploy') ||
    lowerMessage.includes('launch') ||
    lowerMessage.includes('publish')
  ) {
    return withSource(
      {
        reply: `Deployment is wired through the admin operator console and git-based release flow. Latest deployment status: ${latestDeployment}`,
        suggestions: [
          { label: 'Open admin', href: '/admin/login' },
          { label: 'Contact deployment team', href: '/contact' },
        ],
      },
      'fallback'
    )
  }

  if (lowerMessage.includes('paypal') || lowerMessage.includes('payment')) {
    return withSource(
      {
        reply: `Payment readiness is surfaced directly on the pricing and program pages. Direct checkout appears only on eligible offers, while higher-touch experiences use an inquiry-first planning path.`,
        suggestions: [
          { label: 'See checkout options', href: '/pricing' },
          { label: 'Contact the planning team', href: '/contact' },
        ],
      },
      'fallback'
    )
  }

  return withSource(
    {
      reply: `${SITE_DISPLAY_NAME} is built to help families and organizers discover, compare, and plan Georgia camp experiences with more clarity. Right now the platform is tracking ${context.analytics.visitors ?? 0} visitors, ${context.analytics.leads ?? 0} leads, and ${context.analytics.purchases ?? 0} purchases.`,
      suggestions: [
        { label: 'Explore programs', href: '/products' },
        { label: 'Talk to the team', href: '/contact' },
      ],
    },
    'fallback'
  )
}

export async function answerPublicAssistant({ message, history = [] }) {
  if (typeof message !== 'string' || !message.trim()) {
    throw new Error('A message is required.')
  }

  const [analytics, commerce, deployments] = await Promise.all([
    getAnalyticsSnapshot(),
    getCommerceSnapshot(),
    getDeploymentHistory(),
  ])
  const context = buildContext(analytics, commerce, deployments)
  const fallback = buildFallbackResponse(message.trim(), context)

  if (!hasOpenAiKey()) {
    return fallback
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are the public-facing concierge for ${SITE_DISPLAY_NAME}. Answer like a senior product strategist with concise, direct guidance.

Return JSON only in this shape:
{
  "reply": "short helpful answer",
  "suggestions": [
    { "label": "Open pricing", "href": "/pricing" }
  ]
}

Rules:
- Keep replies under 120 words.
- Stay grounded in the provided business context.
- Prefer routing users to pricing, products, contact, or admin.
- Do not invent credentials, customer logos, or deployment claims.`,
        },
        {
          role: 'user',
          content: `Business context:
${JSON.stringify(context, null, 2)}`,
        },
        ...normalizeHistory(history),
        {
          role: 'user',
          content: message.trim(),
        },
      ],
    })

    const payload = JSON.parse(completion.choices[0]?.message?.content ?? '{}')
    if (typeof payload.reply !== 'string' || !payload.reply.trim()) {
      return fallback
    }

    return withSource(
      {
        reply: payload.reply.trim(),
        suggestions: Array.isArray(payload.suggestions)
          ? payload.suggestions
              .filter(
                (entry) =>
                  entry &&
                  typeof entry.label === 'string' &&
                  typeof entry.href === 'string'
              )
              .slice(0, 3)
          : fallback.suggestions,
      },
      'openai'
    )
  } catch {
    return fallback
  }
}
