import './lib/loadEnvironment.js'
import fs from 'node:fs/promises'
import path from 'node:path'
import { repoRoot } from '../server/services/platformPaths.js'

const publicDir = path.join(repoRoot, 'frontend', 'public')
const contentPagesDir = path.join(repoRoot, 'content', 'pages')
const contentBlogDir = path.join(repoRoot, 'content', 'blog')
const contentProductsDir = path.join(repoRoot, 'content', 'products')

function normalizeSiteUrl(value) {
  const raw = String(value ?? '').trim()
  if (!raw) return 'https://calistique.xyz'

  const stripped = raw.includes('SITE_URL=')
    ? raw.split('SITE_URL=').at(-1).trim()
    : raw

  const withProtocol = /^https?:\/\//i.test(stripped)
    ? stripped
    : `https://${stripped.replace(/^\/+/u, '')}`

  try {
    const url = new URL(withProtocol)
    if (/campdreamga/i.test(url.hostname)) {
      return 'https://calistique.xyz'
    }
    return `${url.protocol}//${url.hostname}`.replace(/\/+$/u, '')
  } catch {
    return 'https://calistique.xyz'
  }
}

const SITE_URL = normalizeSiteUrl(process.env.SITE_URL)

const inferredPublisherIdFromClient = (() => {
  const clientId = process.env.VITE_ADSENSE_CLIENT_ID
  if (!clientId) return null
  const match = clientId.match(/^ca-pub-(\d+)$/i)
  return match ? `pub-${match[1]}` : null
})()

const ADSENSE_PUBLISHER_ID =
  process.env.ADSENSE_PUBLISHER_ID ||
  process.env.ADSENSE_PUBLISHER ||
  inferredPublisherIdFromClient ||
  'pub-5800977493749262'

async function readJsonFiltered(directory, key, expectedValue) {
  const entries = await fs.readdir(directory, { withFileTypes: true }).catch(() => [])
  const results = []
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue
    try {
      const raw = await fs.readFile(path.join(directory, entry.name), 'utf8')
      const parsed = JSON.parse(raw)
      if (!key || !expectedValue || parsed[key] === expectedValue) {
        results.push({ slug: entry.name.replace(/\.json$/i, ''), data: parsed })
      }
    } catch {
      // skip malformed JSON
    }
  }
  return results
}

async function collectRoutes() {
  const routes = new Set([
    '/',
    '/products',
    '/blog',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/disclosure',
    '/drops/drop-001-obsidian',
  ])

  // Blog posts — only Calistique-tagged entries
  const blogFiles = await readJsonFiltered(contentBlogDir, 'updatedFor', 'calistique')
  for (const { slug, data } of blogFiles) {
    if (slug === 'index' || !data.slug) continue
    routes.add(`/blog/${data.slug}`)
  }

  // Products — from catalog
  try {
    const catalogPath = path.join(contentProductsDir, 'catalog.json')
    const raw = await fs.readFile(catalogPath, 'utf8')
    const catalog = JSON.parse(raw)
    const products = Array.isArray(catalog?.products) ? catalog.products : []
    for (const product of products) {
      if (product?.slug) {
        routes.add(`/products/${product.slug}`)
      }
    }
  } catch {
    // catalog missing or invalid — skip product routes
  }

  return [...routes].sort()
}

function routePriority(route) {
  if (route === '/') return { priority: '1.0', changefreq: 'weekly' }
  if (route === '/products') return { priority: '0.9', changefreq: 'weekly' }
  if (route === '/blog') return { priority: '0.85', changefreq: 'weekly' }
  if (route.startsWith('/drops/')) return { priority: '0.85', changefreq: 'monthly' }
  if (route.startsWith('/products/')) return { priority: '0.8', changefreq: 'monthly' }
  if (route.startsWith('/blog/')) return { priority: '0.75', changefreq: 'monthly' }
  if (['/about', '/contact'].includes(route)) return { priority: '0.7', changefreq: 'monthly' }
  return { priority: '0.5', changefreq: 'yearly' }
}

async function generateSitemap() {
  const routes = await collectRoutes()
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => {
    const { priority, changefreq } = routePriority(route)
    return `  <url>
    <loc>${SITE_URL}${route === '/' ? '' : route}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  })
  .join('\n')}
</urlset>
`

  await fs.writeFile(path.join(publicDir, 'sitemap.xml'), xml, 'utf8')
}

async function generateRobots() {
  const content = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: ${SITE_URL}/sitemap.xml
`
  await fs.writeFile(path.join(publicDir, 'robots.txt'), content, 'utf8')
}

async function generateAdsTxt() {
  const content = `google.com, ${ADSENSE_PUBLISHER_ID}, DIRECT, f08c47fec0942fa0
`
  await fs.writeFile(path.join(publicDir, 'ads.txt'), content, 'utf8')
}

async function main() {
  await fs.mkdir(publicDir, { recursive: true })
  await generateSitemap()
  await generateRobots()
  await generateAdsTxt()
}

main().catch((error) => {
  console.error('Failed to generate SEO assets.', error)
  process.exitCode = 1
})
