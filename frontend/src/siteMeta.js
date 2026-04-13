const runtimeEnv =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : typeof process !== 'undefined'
      ? process.env
      : {}

export const REPOSITORY_URL = 'https://github.com/3000Studios/calistique'

export const SITE_DISPLAY_NAME = 'Calistique'
export const SITE_LEGAL_NAME = 'Calistique'
export const SITE_DOMAIN = 'calistique.com'
export const SITE_URL = `https://${SITE_DOMAIN}`
export const WWW_SITE_URL = `https://www.${SITE_DOMAIN}`
export const SITE_CATEGORY = 'Luxury clothing and jewelry storefront'
export const SITE_DEFAULT_TITLE = `${SITE_DISPLAY_NAME} | Clothing and jewelry`
export const SITE_DEFAULT_DESCRIPTION =
  'Calistique combines editorial product pages, featured products, and ad inventory into a luxury storefront.'
export const COPYRIGHT_HOLDER = SITE_LEGAL_NAME
export const SUPPORT_EMAIL = 'hello@calistique.com'
export const CONTACT_EMAIL = SUPPORT_EMAIL
export const PAYMENT_FALLBACK_LABEL = 'your configured checkout provider'
export const ADSENSE_CLIENT_ID = runtimeEnv.VITE_ADSENSE_CLIENT_ID ?? ''
export const ADS_ENABLED =
  String(runtimeEnv.VITE_ENABLE_ADS ?? 'true').toLowerCase() === 'true'

export function getCopyrightLine() {
  return `© ${new Date().getFullYear()} ${COPYRIGHT_HOLDER} · ${SITE_DOMAIN} · All rights reserved`
}
