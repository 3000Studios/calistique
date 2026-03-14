import { validateCommand } from '../ai/router/commandRouter.js'
import { bootstrapContent, getContentBundle } from '../server/services/contentService.js'
import { getAnalyticsSnapshot } from '../server/services/analyticsService.js'
import { resolveModelRoute } from '../ai/router/modelRouter.js'

await bootstrapContent()

const content = await getContentBundle()
const analytics = await getAnalyticsSnapshot()
const command = validateCommand({
  action: 'create_blog_post',
  topic: 'AI automation',
  autoDeploy: false
})
const modelRoute = await resolveModelRoute({ action: 'create_blog_post' })

console.log(
  JSON.stringify(
    {
      ok: true,
      contentCounts: {
        pages: content.pages.length,
        blog: content.blog.length,
        products: content.products.length
      },
      analyticsSummary: {
        visitors: analytics.visitors,
        conversionRate: analytics.conversionRate
      },
      sampleCommand: command,
      modelRoute
    },
    null,
    2
  )
)
