import { getContentBundle, getSystemDefault, readSystemDocument, writeSystemDocument } from './contentService.js'
import { listAvailableModels } from './ollamaService.js'

const DEFAULT_ANALYTICS = {
  visitors: 0,
  conversionRate: 0,
  revenue: 0,
  aiActivity: {
    commandsToday: 0,
    deploymentsToday: 0,
    lastAction: 'idle'
  },
  updatedAt: '2026-03-14T00:00:00.000Z'
}

function nowIso() {
  return new Date().toISOString()
}

export async function recordAiActivity(action) {
  const analytics = await readSystemDocument('analytics.json', DEFAULT_ANALYTICS)
  analytics.aiActivity = analytics.aiActivity ?? DEFAULT_ANALYTICS.aiActivity
  analytics.aiActivity.commandsToday += 1
  analytics.aiActivity.lastAction = action
  analytics.updatedAt = nowIso()
  await writeSystemDocument('analytics.json', analytics)
  return analytics
}

export async function recordDeploymentActivity() {
  const analytics = await readSystemDocument('analytics.json', DEFAULT_ANALYTICS)
  analytics.aiActivity = analytics.aiActivity ?? DEFAULT_ANALYTICS.aiActivity
  analytics.aiActivity.deploymentsToday += 1
  analytics.updatedAt = nowIso()
  await writeSystemDocument('analytics.json', analytics)
  return analytics
}

export async function getAnalyticsSnapshot() {
  const [analytics, bundle, models, traffic] = await Promise.all([
    readSystemDocument('analytics.json', DEFAULT_ANALYTICS),
    getContentBundle(),
    listAvailableModels(),
    readSystemDocument('traffic.json', getSystemDefault('traffic.json'))
  ])

  return {
    ...analytics,
    contentCounts: {
      pages: bundle.pages.length,
      blog: bundle.blog.length,
      products: bundle.products.length
    },
    traffic: {
      queuedTopics: traffic.queue?.length ?? 0,
      publishedPages: traffic.published?.length ?? 0,
      topQueuedTopic: traffic.queue?.[0] ?? null
    },
    models
  }
}
