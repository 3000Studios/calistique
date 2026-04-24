const runtimeEnv =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : typeof process !== 'undefined'
      ? process.env
      : {}

const defaultSite = {
  repositoryUrl: 'https://github.com/3000Studios/calistique',
  displayName: 'Calistique',
  legalName: 'Calistique',
  domain: 'calistique.xyz',
  category: 'Luxury streetwear and statement jewelry',
  supportEmail: 'hello@calistique.xyz',
  title: 'Calistique | Luxury streetwear + statement jewelry',
  description:
    'Calistique is a luxury streetwear and statement-jewelry studio built around limited drops, elevated essentials, and flawless fulfillment.',
}

export const REPOSITORY_URL = runtimeEnv.VITE_REPOSITORY_URL ?? defaultSite.repositoryUrl
export const SITE_DISPLAY_NAME = runtimeEnv.VITE_SITE_DISPLAY_NAME ?? defaultSite.displayName
export const SITE_LEGAL_NAME = runtimeEnv.VITE_SITE_LEGAL_NAME ?? defaultSite.legalName
export const SITE_DOMAIN = runtimeEnv.VITE_SITE_DOMAIN ?? defaultSite.domain
export const SITE_URL = `https://${SITE_DOMAIN}`
export const WWW_SITE_URL = `https://www.${SITE_DOMAIN}`
export const SITE_CATEGORY = runtimeEnv.VITE_SITE_CATEGORY ?? defaultSite.category
export const SITE_DEFAULT_TITLE =
  runtimeEnv.VITE_SITE_TITLE ?? `${SITE_DISPLAY_NAME} | Luxury fashion and jewelry`
export const SITE_DEFAULT_DESCRIPTION =
  runtimeEnv.VITE_SITE_DESCRIPTION ?? defaultSite.description
export const COPYRIGHT_HOLDER = SITE_LEGAL_NAME
export const SUPPORT_EMAIL = runtimeEnv.VITE_SUPPORT_EMAIL ?? defaultSite.supportEmail
export const CONTACT_EMAIL = SUPPORT_EMAIL
export const PAYMENT_FALLBACK_LABEL = 'your configured checkout provider'
export const ADSENSE_CLIENT_ID = runtimeEnv.VITE_ADSENSE_CLIENT_ID ?? ''
export const ADS_ENABLED =
  String(runtimeEnv.VITE_ENABLE_ADS ?? 'true').toLowerCase() === 'true'

export const SITE_BRAND = {
  displayName: SITE_DISPLAY_NAME,
  legalName: SITE_LEGAL_NAME,
  domain: SITE_DOMAIN,
  url: SITE_URL,
  wwwUrl: WWW_SITE_URL,
  category: SITE_CATEGORY,
  supportEmail: SUPPORT_EMAIL,
  repositoryUrl: REPOSITORY_URL,
  title: SITE_DEFAULT_TITLE,
  description: SITE_DEFAULT_DESCRIPTION,
}

export function getCopyrightLine() {
  return `© ${new Date().getFullYear()} ${COPYRIGHT_HOLDER} · ${SITE_DOMAIN} · All rights reserved`
}
