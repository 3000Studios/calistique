import './lib/loadEnvironment.js'
import fs from 'node:fs/promises'
import path from 'node:path'
import { repoRoot } from '../server/services/platformPaths.js'

const publicDir = path.join(repoRoot, 'frontend', 'public')
const contentPagesDir = path.join(repoRoot, 'content', 'pages')
const contentBlogDir = path.join(repoRoot, 'content', 'blog')
const contentProductsDir = path.join(repoRoot, 'content', 'products')

const SITE_URL = process.env.SITE_URL || 'https://myappai.net'
const ADSENSE_PUBLISHER_ID =
  process.env.ADSENSE_PUBLISHER_ID ||
  process.env.ADSENSE_PUBLISHER ||
  'pub-0000000000000000'

async function collectRoutes() {
  const routes = new Set(['/'])

  const readJsonFiles = async (directory, transform) => {
    const entries = await fs.readdir(directory, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith('.json')) continue
      const slug = entry.name.replace(/\.json$/i, '')
      const route = transform(slug)
      if (route) routes.add(route)
    }
  }

  await readJsonFiles(contentPagesDir, (slug) =>
    ['homepage', 'platform', 'pricing'].includes(slug)
      ? `/${slug}`
      : slug === 'theme'
        ? null
        : `/${slug}`
  )
  await readJsonFiles(contentBlogDir, (slug) =>
    slug === 'index' ? '/blog' : `/blog/${slug}`
  )
  await readJsonFiles(contentProductsDir, (slug) =>
    slug === 'catalog' ? '/products' : `/menu/${slug}`
  )

  return [...routes].sort()
}

async function generateSitemap() {
  const routes = await collectRoutes()
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route === '/' ? '' : route}</loc>
  </url>`
  )
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
