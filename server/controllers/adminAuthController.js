import {
  createAdminSession,
  destroyAdminSession,
  setAdminSessionCookie,
  validateAdminCredentials,
} from '../services/adminSessionService.js'

export function postAdminLogin(request, response) {
  const { email, code, adminKey = '' } = request.body ?? {}
  const result = validateAdminCredentials(email, code, adminKey)

  if (!result.ok) {
    response.status(403).json({
      ok: false,
      message: result.message,
    })
    return
  }

  const session = createAdminSession(result.email)
  setAdminSessionCookie(response, session.signedToken)
  response.json({
    ok: true,
    adminEmail: result.email,
    authMode: result.authMode,
  })
}

export function getAdminSessionState(request, response) {
  if (!request.admin?.email) {
    response.status(401).json({
      ok: false,
      message: 'No active admin session.',
    })
    return
  }

  response.json({
    ok: true,
    adminEmail: request.admin.email,
    authMode: request.admin.authMode,
  })
}

export function postAdminLogout(request, response) {
  destroyAdminSession(request, response)
  response.json({
    ok: true,
  })
}
