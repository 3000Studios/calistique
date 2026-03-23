import { SITE_DOMAIN } from './siteMeta.js'

export const publicNavItems = [
  { label: 'Home', to: '/' },
  { label: 'Summer Camp', to: '/summer-camp' },
  { label: 'Camp Out', to: '/camp-out' },
  { label: 'What We Do', to: '/what-we-do' },
  { label: 'Volunteer', to: '/volunteer' },
  { label: 'Donate', to: '/donate' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
]

export const footerLegalItems = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Service', to: '/terms-of-service' },
  { label: 'Cookie Policy', to: '/cookie-policy' },
  { label: 'Advertising Disclosure', to: '/advertising-disclosure' },
]

export const publicStatusLines = [
  'SINCE 1996',
  '1:1 VOLUNTEER MODEL',
  'BARRIER-FREE CAMP',
  SITE_DOMAIN,
]

export const publicTickerItems = [
  '// SUMMER CAMP + CAMP OUT PROGRAMS FOR CHILDREN AND YOUNG ADULTS WITH DISABILITIES',
  '// 100% VOLUNTEER OPERATIONS HELP KEEP A 1:1 CAMPER-TO-COUNSELOR EXPERIENCE POSSIBLE',
  '// DONATIONS, SPONSORSHIP, AND COMMUNITY SUPPORT HELP KEEP COSTS LOW FOR FAMILIES',
  '// STORIES, FAQS, AND YEAR-ROUND UPDATES HELP FAMILIES, VOLUNTEERS, AND DONORS STAY CONNECTED',
]

export const adminNavItems = [
  { label: 'Overview', to: '/admin/overview' },
  { label: 'Sign in', to: '/admin/login' },
  { label: 'Public site', to: '/' },
  { label: 'Resources', to: '/blog' },
  { label: 'Programs', to: '/products' },
]

export const adminStatusLines = [
  'OPERATIONS: ONLINE',
  'CONTENT: READY',
  `${SITE_DOMAIN} // admin`,
]

export const adminTickerItems = [
  '// ANALYTICS + DEPLOY + CONTENT + AI CONSOLE',
  '// SESSION-BASED ADMIN AUTH',
  '// REVENUE, SEO, AND LEADS SHARE ONE DATA LAYER',
  '// PUBLIC SITE IS OPTIMIZED FOR TRUST, BOOKINGS, AND ADSENSE READINESS',
]
