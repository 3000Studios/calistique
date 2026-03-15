const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'mr.jwswain@gmail.com'
const DEFAULT_ADMIN_CODE = process.env.ADMIN_PASSCODE ?? '5555'

export function adminAuth(request, response, next) {
  const email = request.headers['x-admin-email']
  const code = request.headers['x-admin-code']

  if (email !== DEFAULT_ADMIN_EMAIL || code !== DEFAULT_ADMIN_CODE) {
    response.status(403).json({
      error: 'Admin access required',
      message: 'Valid admin credentials are required for this route.'
    })
    return
  }

  request.admin = {
    email
  }
  next()
}
