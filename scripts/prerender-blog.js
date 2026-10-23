// Prerenders the blog index, every blog post, and /about into static HTML
// inside dist/ at build time, using the built SPA shell (dist/index.html) as
// the template. Crawlers and no-JS visitors get the full article text in raw
// HTML; the React app still boots from the same shell and replaces #root on
// render, so the interactive experience is unchanged.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = path.join(repoRoot, 'dist')
const blogDir = path.join(repoRoot, 'content', 'blog')
const SITE_URL = 'https://calistique.xyz'
const SUPPORT_EMAIL = 'hello@calistique.xyz'

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function paragraphs(body) {
  if (Array.isArray(body)) return body.map((b) => paragraphs(b)).join('\n')
  return String(body ?? '')
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => `<p>${esc(chunk).replaceAll('\n', '<br>')}</p>`)
    .join('\n')
}

function loadPosts() {
  const posts = []
  for (const name of fs.readdirSync(blogDir)) {
    if (!name.endsWith('.json')) continue
    try {
      const data = JSON.parse(fs.readFileSync(path.join(blogDir, name), 'utf8'))
      if (data.updatedFor === 'calistique' && data.slug && data.slug !== 'index') {
        posts.push(data)
      }
    } catch {
      // skip malformed JSON, same as scripts/generate-seo-assets.js
    }
  }
  return posts.sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))
}

function renderPage(shell, { title, description, canonical, type = 'website', inner, jsonLd }) {
  let html = shell
  const swap = (regex, replacement) => {
    if (regex.test(html)) html = html.replace(regex, replacement)
    else html = html.replace('</head>', `${replacement}\n</head>`)
  }
  swap(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`)
  swap(
    /<meta[^>]*name="description"[^>]*>/i,
    `<meta name="description" content="${esc(description)}" />`,
  )
  swap(/<link[^>]*rel="canonical"[^>]*>/i, `<link rel="canonical" href="${esc(canonical)}" />`)
  swap(/<meta[^>]*property="og:title"[^>]*>/i, `<meta property="og:title" content="${esc(title)}" />`)
  swap(
    /<meta[^>]*property="og:description"[^>]*>/i,
    `<meta property="og:description" content="${esc(description)}" />`,
  )
  swap(/<meta[^>]*property="og:url"[^>]*>/i, `<meta property="og:url" content="${esc(canonical)}" />`)
  swap(/<meta[^>]*property="og:type"[^>]*>/i, `<meta property="og:type" content="${type}" />`)
  swap(
    /<meta[^>]*name="twitter:title"[^>]*>/i,
    `<meta name="twitter:title" content="${esc(title)}" />`,
  )
  swap(
    /<meta[^>]*name="twitter:description"[^>]*>/i,
    `<meta name="twitter:description" content="${esc(description)}" />`,
  )
  if (jsonLd) {
    html = html.replace(
      '</head>',
      `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n</head>`,
    )
  }
  if (/<div id="root">\s*<\/div>/.test(html)) {
    html = html.replace(/<div id="root">\s*<\/div>/, `<div id="root">${inner}</div>`)
  } else {
    html = html.replace('<div id="root">', `<div id="root">${inner}`)
  }
  return html
}

function postInner(post) {
  const sections = (post.sections || [])
    .map(
      (section) => `        <div class="article-section section-card">
          <h2>${esc(section.heading)}</h2>
          ${paragraphs(section.body)}
        </div>`,
    )
    .join('\n')
  const cta = post.cta
    ? `
      <section class="section-card cta-band">
        <div>
          <span class="eyebrow">${esc(post.cta.eyebrow)}</span>
          <h2>${esc(post.cta.heading)}</h2>
          <p class="section-intro">${esc(post.cta.body)}</p>
        </div>
        <div class="hero__actions">
          <a class="button button--primary" href="${esc(post.cta.primaryHref)}">${esc(post.cta.primaryLabel)}</a>
        </div>
      </section>`
    : ''
  return `<article class="stack-2xl">
      <section class="section-card article-hero">
        <span class="meta-line">${esc(post.publishedAt)}</span>
        <h1>${esc(post.title)}</h1>
        <p class="section-intro">${esc(post.excerpt)}</p>
      </section>
      <section class="stack-xl article-stack">
${sections}
      </section>${cta}
    </article>`
}

function blogIndexInner(posts) {
  const cards = posts
    .map(
      (post) => `        <article class="blog-card">
          <span class="meta-line">${esc(post.publishedAt)}</span>
          <h2>${esc(post.title)}</h2>
          <p>${esc(post.excerpt)}</p>
          <a class="button button--ghost" href="/blog/${esc(post.slug)}">Read more</a>
        </article>`,
    )
    .join('\n')
  return `<article class="prose-page blog-index">
      <header class="prose-header">
        <span class="eyebrow">Style Notes</span>
        <h1>Streetwear, jewelry, and drop strategy.</h1>
        <p class="prose-lead">Editorial built to rank, convert, and reinforce the brand. Every post is structured for clarity, trust, and checkout intent.</p>
      </header>
      <section class="blog-grid">
${cards}
      </section>
      <section class="blog-disclosure">
        <p>Affiliate disclosure: some outbound links may earn commissions. Sponsored placements are labeled and kept separate from editorial recommendations.</p>
      </section>
    </article>`
}

const aboutInner = `<article class="page-shell">
      <section class="lux-section-heading lux-section-heading--center">
        <span class="lux-eyebrow">About</span>
        <h1>About Calistique</h1>
      </section>
      <p>Calistique is a practical notebook about style, planning, and personal organization — the everyday systems that make life run smoother. We write about capsule wardrobes and closet organization, weekly planning rituals that survive contact with real life, gift guides, packing methods, and the small home routines (like the Sunday reset) that keep chaos at bay.</p>
      <p>The approach is simple: concrete advice, real specifics, no fluff. Every article aims to give you something you can actually do — a checklist, a method, a list — not just inspiration.</p>
      <p>Calistique is published by 3000 Studios, an independent digital media studio. The site is written and maintained by our small editorial team. We don't publish sponsored content disguised as advice.</p>
      <section class="lux-account-grid">
        <div class="lux-panel">
          <h2>Our editorial standards</h2>
          <p>Advice must be actionable — if you can't do something with it this week, it gets rewritten until you can. Recommendations must be honest. Everything gets reviewed for accuracy before it goes live; when we get something wrong, we correct it and note the change. We write for real life, not an idealized version of it.</p>
        </div>
        <div class="lux-panel">
          <h2>What you'll find here</h2>
          <ul class="lux-feature-list">
            <li>Style guides (outfit planning, capsule wardrobes, seasonal transitions, closet organization)</li>
            <li>Planning systems (weekly reviews, routines)</li>
            <li>Gift guides (thoughtful, budget-honest recommendations)</li>
            <li>Home organization (decluttering, small-space setups, maintenance routines)</li>
          </ul>
        </div>
      </section>
      <section class="lux-section-heading lux-section-heading--center">
        <p>Questions or feedback? Reach us at <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>
      </section>
    </article>`

function writePage(routePath, html) {
  const dir = path.join(distRoot, routePath)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html)
}

const shellPath = path.join(distRoot, 'index.html')
if (!fs.existsSync(shellPath)) {
  throw new Error('prerender-blog: dist/index.html missing — run after vite build')
}
const shell = fs.readFileSync(shellPath, 'utf8')
const posts = loadPosts()

writePage(
  'blog',
  renderPage(shell, {
    title: 'Style Notes | Calistique',
    description:
      'Style Notes from Calistique: capsule wardrobes, jewelry guides, closet organization, planning systems, and gift guides — concrete advice with real specifics.',
    canonical: `${SITE_URL}/blog`,
    inner: blogIndexInner(posts),
  }),
)

for (const post of posts) {
  writePage(
    path.join('blog', post.slug),
    renderPage(shell, {
      title: `${post.title} | Calistique`,
      description: post.excerpt,
      canonical: `${SITE_URL}/blog/${post.slug}`,
      type: 'article',
      inner: postInner(post),
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        author: { '@type': 'Organization', name: 'Calistique' },
        publisher: { '@type': 'Organization', name: '3000 Studios' },
        mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
      },
    }),
  )
}

writePage(
  'about',
  renderPage(shell, {
    title: 'About Calistique | Calistique',
    description:
      'Calistique is a practical notebook about style, planning, and personal organization — published by 3000 Studios, an independent digital media studio.',
    canonical: `${SITE_URL}/about`,
    inner: aboutInner,
  }),
)

console.log(`prerender-blog: wrote /blog index, ${posts.length} post pages, /about`)
