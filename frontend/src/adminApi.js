const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

async function request(path, { apiKey, method = 'GET', body } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`
    },
    body: body ? JSON.stringify(body) : undefined
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload.message ?? 'Request failed.')
  }

  return payload
}

export function getAnalytics(apiKey) {
  return request('/api/analytics', { apiKey })
}

export function getDeployments(apiKey) {
  return request('/api/deployments', { apiKey })
}

export function getContent(apiKey) {
  return request('/api/content', { apiKey })
}

export function sendCommand(apiKey, command) {
  return request('/api/command', {
    apiKey,
    method: 'POST',
    body: command
  })
}
