import React from 'react'
import { useLocation } from 'react-router-dom'
import { blogLookup, pageLookup, pricingPage, productLookup } from '../src/siteData.js'
import {
  SITE_CATEGORY,
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_TITLE,
  SITE_DISPLAY_NAME,
  SITE_URL
} from '../src/siteMeta.js'

function ensureMeta(selector, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })

  return element
}

function ensureLink(selector, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('link')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })

  return element
}

function buildFaqSchema(entries) {
  if (!entries?.length) {
    return null
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer
      }
    }))
  }
}

function parsePriceAnchor(priceAnchor) {
  const normalized = Number.parseFloat(String(priceAnchor ?? '').replace(/[^0-9.]/g, ''))
  return Number.isFinite(normalized) ? normalized : null
}

function buildProductSchema(product, canonicalUrl) {
  if (!product) {
    return null
  }

  const price = parsePriceAnchor(product.priceAnchor)
  const closeMode = product.closeMode ?? (product.slug === 'operator-os' ? 'checkout' : product.slug === 'launch-sprint' ? 'lead' : 'qualification')
  const base = {
    '@context': 'https://schema.org',
    '@type': closeMode === 'checkout' ? 'SoftwareApplication' : 'Service',
    name: product.name,
    description: product.description ?? product.summary ?? '',
    url: canonicalUrl,
    provider: {
      '@type': 'Organization',
      name: SITE_DISPLAY_NAME,
      url: SITE_URL
    }
  }

  if (price !== null && closeMode !== 'qualification') {
    base.offers = {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price,
      availability: 'https://schema.org/InStock',
      url: canonicalUrl
    }
  }

  return base
}

function buildPricingSchema(canonicalUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: `${SITE_DISPLAY_NAME} offer catalog`,
    url: canonicalUrl,
    itemListElement: pricingPage.tiers.map((tier) => ({
      '@type': 'Offer',
      name: tier.name,
      description: tier.description,
      priceCurrency: 'USD',
      price: parsePriceAnchor(tier.price)
    }))
  }
}

function buildContactSchema(canonicalUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `${SITE_DISPLAY_NAME} contact`,
    url: canonicalUrl,
    about: {
      '@type': 'Organization',
      name: SITE_DISPLAY_NAME,
      url: SITE_URL
    }
  }
}

function getSeoForPath(pathname) {
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
  const segments = normalizedPath.split('/').filter(Boolean)
  const canonicalUrl = normalizedPath === '/' ? SITE_URL : `${SITE_URL}${normalizedPath}`

  const base = {
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    canonicalUrl,
    schema: null,
    faqSchema: null
  }

  if (normalizedPath === '/') {
    const page = pageLookup.homepage
    return {
      ...base,
      title: `${SITE_DISPLAY_NAME} | Voice to website delivery with AI-managed execution`,
      description: page?.subheadline ?? SITE_DEFAULT_DESCRIPTION,
      faqSchema: buildFaqSchema(page?.faq)
    }
  }

  if (normalizedPath === '/pricing') {
    return {
      ...base,
      title: `Pricing | ${SITE_DISPLAY_NAME}`,
      description: pricingPage.subheadline ?? SITE_DEFAULT_DESCRIPTION,
      schema: buildPricingSchema(canonicalUrl),
      faqSchema: buildFaqSchema(pricingPage.faq)
    }
  }

  if (normalizedPath === '/products') {
    return {
      ...base,
      title: `Products | ${SITE_DISPLAY_NAME}`,
      description: 'Compare Operator OS, Launch Sprint, and Enterprise Deployment based on how you want to buy and ship.',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${SITE_DISPLAY_NAME} products`,
        url: canonicalUrl
      }
    }
  }

  if (segments[0] === 'products' && segments[1]) {
    const product = productLookup[segments[1]]
    if (product) {
      return {
        ...base,
        title: `${product.name} | ${SITE_DISPLAY_NAME}`,
        description: product.description ?? product.summary ?? SITE_DEFAULT_DESCRIPTION,
        schema: buildProductSchema(product, canonicalUrl)
      }
    }
  }

  if (normalizedPath === '/blog') {
    return {
      ...base,
      title: `Blog | ${SITE_DISPLAY_NAME}`,
      description: 'Strategy, execution, and productized service insights for turning briefs into live revenue systems.'
    }
  }

  if (segments[0] === 'blog' && segments[1]) {
    const post = blogLookup[segments[1]]
    if (post) {
      return {
        ...base,
        title: `${post.title} | ${SITE_DISPLAY_NAME}`,
        description: post.excerpt ?? SITE_DEFAULT_DESCRIPTION,
        schema: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt ?? '',
          datePublished: post.publishedAt,
          author: {
            '@type': 'Organization',
            name: SITE_DISPLAY_NAME
          },
          publisher: {
            '@type': 'Organization',
            name: SITE_DISPLAY_NAME,
            url: SITE_URL
          },
          url: canonicalUrl
        }
      }
    }
  }

  if (segments[0] && pageLookup[segments[0]]) {
    const page = pageLookup[segments[0]]
    return {
      ...base,
      title: `${page.headline ?? page.title ?? segments[0]} | ${SITE_DISPLAY_NAME}`,
      description: page.subheadline ?? page.intro ?? SITE_DEFAULT_DESCRIPTION,
      schema: segments[0] === 'contact' ? buildContactSchema(canonicalUrl) : null,
      faqSchema: buildFaqSchema(page.faq)
    }
  }

  return base
}

export default function SiteSeo() {
  const location = useLocation()

  React.useEffect(() => {
    const seo = getSeoForPath(location.pathname)
    document.title = seo.title
    document.documentElement.lang = 'en'

    ensureMeta('meta[name="description"]', { name: 'description', content: seo.description })
    ensureMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title })
    ensureMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description })
    ensureMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
    ensureMeta('meta[property="og:url"]', { property: 'og:url', content: seo.canonicalUrl })
    ensureMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_DISPLAY_NAME })
    ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title })
    ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description })
    ensureLink('link[rel="canonical"]', { rel: 'canonical', href: seo.canonicalUrl })

    const schemaTagId = 'site-structured-data'
    let schemaTag = document.getElementById(schemaTagId)
    const schemas = [seo.schema, seo.faqSchema].filter(Boolean)

    if (schemas.length === 0) {
      if (schemaTag) {
        schemaTag.remove()
      }
      return
    }

    if (!schemaTag) {
      schemaTag = document.createElement('script')
      schemaTag.type = 'application/ld+json'
      schemaTag.id = schemaTagId
      document.head.appendChild(schemaTag)
    }

    schemaTag.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas)
  }, [location.pathname])

  return null
}
