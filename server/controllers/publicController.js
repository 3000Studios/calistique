import {
  capturePayPalOrder,
  createPayPalCheckout,
  createStripeCheckout,
  getCommerceSnapshot,
  verifyStripeCheckoutSession
} from '../services/commerceService.js'
import { answerPublicAssistant } from '../services/assistantService.js'
import { getAnalyticsSnapshot, recordLead, recordSiteEvent } from '../services/analyticsService.js'
import { getDeploymentHistory } from '../services/deploymentService.js'
import { SITE_CATEGORY, SITE_DISPLAY_NAME, SITE_URL } from '../../frontend/src/siteMeta.js'

function getOrigin(request) {
  const originHeader = request.headers.origin
  if (typeof originHeader === 'string' && originHeader.length > 0) {
    return originHeader
  }

  return `${request.protocol}://${request.get('host')}`
}

export async function getPublicSiteSnapshot(_request, response, next) {
  try {
    const [analytics, commerce, deployments] = await Promise.all([
      getAnalyticsSnapshot(),
      getCommerceSnapshot(),
      getDeploymentHistory()
    ])
    const latestDeployment = deployments.history?.[0] ?? null

    response.json({
      analytics,
      commerce,
      brand: {
        displayName: SITE_DISPLAY_NAME,
        url: SITE_URL,
        category: SITE_CATEGORY
      },
      proof: {
        liveDataOnly: true,
        leadCaptureReady: true,
        revenueTrackingReady: true,
        adminSurfaceReady: true,
        trafficEngineReady: true,
        configuredPaymentProviders: Object.entries(commerce.providers)
          .filter(([, enabled]) => enabled)
          .map(([provider]) => provider),
        checkoutReadyOffers: commerce.offers.filter(
          (offer) => offer.providers.stripe || offer.providers.paypal
        ).length,
        contentCounts: analytics.contentCounts,
        modelsOnline: analytics.models.length,
        latestDeployment: latestDeployment
          ? {
              status: latestDeployment.status,
              finishedAt: latestDeployment.finishedAt ?? latestDeployment.startedAt
            }
          : null
      },
      funnel: {
        mode: 'hybrid_close',
        contactMode: 'lead_form',
        contactPath: '/contact',
        primaryOfferSlug: 'operator-os',
        implementationOfferSlug: 'launch-sprint',
        enterpriseOfferSlug: 'enterprise-deployment',
        offers: commerce.offers.map((offer) => ({
          slug: offer.slug,
          closeMode: offer.closeMode,
          primaryCtaLabel: offer.primaryCtaLabel,
          primaryCtaHref: offer.primaryCtaHref
        }))
      }
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
      event
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
      lead
    })
  } catch (error) {
    next(error)
  }
}

export async function postAssistantMessage(request, response, next) {
  try {
    const assistant = await answerPublicAssistant({
      message: request.body?.message,
      history: request.body?.history
    })
    response.json(assistant)
  } catch (error) {
    next(error)
  }
}

export async function postStripeCheckout(request, response, next) {
  try {
    const checkout = await createStripeCheckout({
      slug: request.body?.offerSlug,
      origin: getOrigin(request)
    })
    response.json(checkout)
  } catch (error) {
    next(error)
  }
}

export async function postPayPalCheckout(request, response, next) {
  try {
    const checkout = await createPayPalCheckout({
      slug: request.body?.offerSlug,
      origin: getOrigin(request)
    })
    response.json(checkout)
  } catch (error) {
    next(error)
  }
}

export async function getStripeCheckoutSuccess(request, response, next) {
  try {
    const sessionId = typeof request.query.session_id === 'string' ? request.query.session_id : ''
    const result = await verifyStripeCheckoutSession(sessionId)
    response.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getPayPalCheckoutSuccess(request, response, next) {
  try {
    const orderId = typeof request.query.token === 'string' ? request.query.token : ''
    const result = await capturePayPalOrder(orderId)
    response.json(result)
  } catch (error) {
    next(error)
  }
}
