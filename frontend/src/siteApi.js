import { mirrorConversionToClientAnalytics } from './analyticsClient.js'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''
const SESSION_KEY = 'myappai_session_id'

async function request(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload.message ?? 'Request failed.')
  }

  return payload
}

export function getVisitorSessionId() {
  if (typeof window === 'undefined') {
    return 'server-render'
  }

  const existing = window.localStorage.getItem(SESSION_KEY)

  if (existing) {
    return existing
  }

  const nextId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  window.localStorage.setItem(SESSION_KEY, nextId)
  return nextId
}

function getCurrentPath() {
  if (typeof window === 'undefined') {
    return '/'
  }

  return `${window.location.pathname}${window.location.search}`
}

export function getPublicSiteSnapshot() {
  return request('/api/public/site')
}

export function trackSiteEvent(event) {
  return request('/api/public/events', {
    method: 'POST',
    body: event,
  })
}

export function trackConversionEvent(type, details = {}) {
  mirrorConversionToClientAnalytics(type, details)

  return trackSiteEvent({
    type,
    path: details.path ?? getCurrentPath(),
    sessionId: details.sessionId ?? getVisitorSessionId(),
    referrer:
      details.referrer ??
      (typeof document === 'undefined' ? '' : document.referrer),
    ctaId: details.ctaId ?? '',
    offerSlug: details.offerSlug ?? '',
    provider: details.provider ?? '',
    intent: details.intent ?? '',
    stage: details.stage ?? '',
    details: details.details ?? null,
  })
}

export function trackCtaClick(details) {
  return trackConversionEvent('cta_click', details)
}

export function submitLead(lead) {
  return request('/api/public/leads', {
    method: 'POST',
    body: lead,
  })
}
