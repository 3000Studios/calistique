import {
  getAnalyticsSnapshot,
  recordLead,
  recordSiteEvent,
} from '../services/analyticsService.js'
import { getDeploymentHistory } from '../services/deploymentService.js'
import {
  SITE_CATEGORY,
  SITE_DISPLAY_NAME,
  SITE_URL,
} from '../../frontend/src/siteMeta.js'

export async function getPublicSiteSnapshot(_request, response, next) {
  try {
    const [analytics, deployments] = await Promise.all([
      getAnalyticsSnapshot(),
      getDeploymentHistory(),
    ])
    const latestDeployment = deployments.history?.[0] ?? null

    response.json({
      analytics,
      brand: {
        displayName: SITE_DISPLAY_NAME,
        url: SITE_URL,
        category: SITE_CATEGORY,
      },
      proof: {
        liveDataOnly: true,
        leadCaptureReady: true,
        adminSurfaceReady: true,
        trafficEngineReady: true,
        contentCounts: analytics.contentCounts,
        modelsOnline: analytics.models.length,
        latestDeployment: latestDeployment
          ? {
              status: latestDeployment.status,
              finishedAt:
                latestDeployment.finishedAt ?? latestDeployment.startedAt,
            }
          : null,
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
    })
  } catch (error) {
    next(error)
  }
}

export async function postSiteEvent(request, response, next) {
  try {
    const event = await recordSiteEvent(request.body ?? {})
    response.json({
      ok: true,
      event,
    })
  } catch (error) {
    next(error)
  }
}

export async function postLeadCapture(request, response, next) {
  try {
    const lead = await recordLead(request.body ?? {})
    response.status(201).json({
      ok: true,
      lead,
    })
  } catch (error) {
    next(error)
  }
}
