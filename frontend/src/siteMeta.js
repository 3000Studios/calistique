/**
 * myappai — project identity
 * Canonical source: https://github.com/3000Studios/voicetowebsite-copyright-mrjwswain
 * (Site assets are proprietary and owned by Mr. jwswain.)
 */

export const REPOSITORY_URL = 'https://github.com/3000Studios/voicetowebsite-copyright-mrjwswain'

export const SITE_DOMAIN = 'voicetowebsite.com'
export const SITE_URL = `https://${SITE_DOMAIN}`
export const SITE_DISPLAY_NAME = 'myappai'
export const SITE_CATEGORY = 'AI system manager for build, automate, and deploy'
export const SITE_DEFAULT_TITLE = `${SITE_DISPLAY_NAME} | ${SITE_CATEGORY}`
export const SITE_DEFAULT_DESCRIPTION =
  'myappai turns natural-language requests into structured pages, deployable workflows, operator visibility, and revenue-ready automation from one control center.'
export const COPYRIGHT_HOLDER = 'Mr. jwswain'

export function getCopyrightLine() {
  return `© ${new Date().getFullYear()} ${COPYRIGHT_HOLDER} · ${SITE_DOMAIN} · All rights reserved`
}
