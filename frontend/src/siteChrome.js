import { SITE_DOMAIN } from './siteMeta.js'

export const publicNavItems = [
  { label: 'Home', to: '/' },
  { label: 'Platform', to: '/platform' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
  { label: 'Admin', to: '/admin' }
]

export const publicStatusLines = [
  'BUILD',
  'AUTOMATE',
  'DEPLOY',
  SITE_DOMAIN
]

export const publicTickerItems = [
  '// NATURAL LANGUAGE TO WORKFLOW, CONTENT, AND DEPLOYMENT',
  '// LIVE OFFERS, LEAD CAPTURE, AND ADMIN COMMANDS SHARE ONE REPO',
  '// PAYPAL CAN ROUTE THROUGH MR.JWSWAIN@GMAIL.COM WHEN DIRECT API KEYS ARE NOT PRESENT',
  '// CUSTOM GPT OPERATOR NOW TARGETS THE REAL FRONTEND AND CONTENT LAYERS'
]

export const adminNavItems = [
  { label: 'Overview', to: '/admin/overview' },
  { label: 'Sign in', to: '/admin/login' },
  { label: 'Public site', to: '/' },
  { label: 'Blog', to: '/blog' },
  { label: 'Products', to: '/products' }
]

export const adminStatusLines = [
  'OPERATIONS: ONLINE',
  'PIPELINE: READY',
  `${SITE_DOMAIN} // admin`
]

export const adminTickerItems = [
  '// ANALYTICS + DEPLOY + CONTENT + AI CONSOLE',
  '// SYNC DATA FROM THE TOP BAR ANYTIME',
  '// USE SECTIONS IN THE SIDEBAR TO STAY FOCUSED',
  '// COMMAND ROUTER FOR ADVANCED AUTOMATION'
]
