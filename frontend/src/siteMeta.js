const runtimeEnv =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : typeof process !== 'undefined'
      ? process.env
      : {}

export const REPOSITORY_URL = 'https://github.com/3000Studios/myappai'

export const SITE_DISPLAY_NAME = 'Camp Dream GA'
export const SITE_LEGAL_NAME = 'Camp Dream GA'
export const SITE_DOMAIN = 'campdreamga.com'
export const SITE_URL = `https://${SITE_DOMAIN}`
export const WWW_SITE_URL = `https://www.${SITE_DOMAIN}`
export const SITE_CATEGORY =
  'Georgia summer camp and community programs for children and young adults with disabilities'
export const SITE_DEFAULT_TITLE = `${SITE_DISPLAY_NAME} | Georgia summer camp and community programs`
export const SITE_DEFAULT_DESCRIPTION =
  'Camp Dream GA shares Summer Camp, Camp Out, volunteer, and donor opportunities for children and young adults with disabilities through one warm, mission-first Georgia camp site.'
export const COPYRIGHT_HOLDER = SITE_LEGAL_NAME
export const SUPPORT_EMAIL = 'hello@campdreamga.com'
export const CONTACT_EMAIL = SUPPORT_EMAIL
export const PAYMENT_FALLBACK_LABEL = 'our secure PayPal payment link'
export const ADSENSE_CLIENT_ID = runtimeEnv.VITE_ADSENSE_CLIENT_ID ?? ''
export const ADS_ENABLED =
  String(runtimeEnv.VITE_ENABLE_ADS ?? 'false').toLowerCase() === 'true'

export function getCopyrightLine() {
  return `© ${new Date().getFullYear()} ${COPYRIGHT_HOLDER} · ${SITE_DOMAIN} · All rights reserved`
}
