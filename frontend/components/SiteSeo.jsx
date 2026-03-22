import React from 'react'
import { useLocation } from 'react-router-dom'
import {
  blogLookup,
  pageLookup,
  pricingPage,
  productCatalog,
  productLookup,
} from '../src/siteData.js'
import {
  ADSENSE_CLIENT_ID,
  ADS_ENABLED,
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_TITLE,
  SITE_DISPLAY_NAME,
  SITE_URL,
  WWW_SITE_URL,
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

function ensureScript(id, attributes = {}) {
  let element = document.getElementById(id)
  if (!element) {
    element = document.createElement('script')
    element.id = id
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'textContent') {
      element.textContent = value
    } else {
      element.setAttribute(key, value)
    }
  })

  return element
}

function removeIfPresent(id) {
  document.getElementById(id)?.remove()
}

function buildBreadcrumbSchema(pathname, title) {
  const parts = pathname.split('/').filter(Boolean)
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
  ]

  parts.forEach((part, index) => {
    const href = `${SITE_URL}/${parts.slice(0, index + 1).join('/')}`
    items.push({
      '@type': 'ListItem',
      position: index + 2,
      name: index === parts.length - 1 ? title : part.replace(/-/g, ' '),
      item: href,
    })
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
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
        text: entry.answer,
      },
    })),
  }
}

function parsePriceAnchor(priceAnchor) {
  const normalized = Number.parseFloat(
    String(priceAnchor ?? '').replace(/[^0-9.]/g, '')
  )
  return Number.isFinite(normalized) ? normalized : null
}

function buildCollectionSchema(pathname, name, description) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: pathname === '/' ? SITE_URL : `${SITE_URL}${pathname}`,
  }
}

function buildProductSchema(product, canonicalUrl) {
  const price = parsePriceAnchor(product.priceAnchor)
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: product.name,
    description: product.description ?? product.summary ?? '',
    url: canonicalUrl,
    provider: {
      '@type': 'Organization',
      name: SITE_DISPLAY_NAME,
      url: SITE_URL,
    },
    offers: price
      ? {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price,
          availability: 'https://schema.org/InStock',
          url: canonicalUrl,
        }
      : undefined,
  }
}

function buildArticleSchema(post, canonicalUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? '',
    datePublished: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: SITE_DISPLAY_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_DISPLAY_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
  }
}

function getSeoForPath(pathname) {
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
  const segments = normalizedPath.split('/').filter(Boolean)
  const canonicalUrl =
    normalizedPath === '/' ? SITE_URL : `${SITE_URL}${normalizedPath}`
  const page = segments[0] ? pageLookup[segments[0]] : pageLookup.homepage

  const base = {
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    canonicalUrl,
    noindex: false,
    adsEligible: false,
    schemas: [],
  }

  if (normalizedPath === '/') {
    return {
      ...base,
      title: `${SITE_DISPLAY_NAME} | Georgia camp experiences and trusted planning resources`,
      description: page?.subheadline ?? SITE_DEFAULT_DESCRIPTION,
      schemas: [
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: SITE_DISPLAY_NAME,
          url: SITE_URL,
          sameAs: [SITE_URL, WWW_SITE_URL],
        },
        buildFaqSchema(page?.faq),
      ].filter(Boolean),
    }
  }

  if (normalizedPath === '/pricing') {
    return {
      ...base,
      title: `Pricing | ${SITE_DISPLAY_NAME}`,
      description: pricingPage.subheadline ?? SITE_DEFAULT_DESCRIPTION,
      schemas: [
        {
          '@context': 'https://schema.org',
          '@type': 'OfferCatalog',
          name: `${SITE_DISPLAY_NAME} pricing`,
          itemListElement: productCatalog.map((product) => ({
            '@type': 'Offer',
            name: product.name,
            description: product.summary,
            priceCurrency: 'USD',
            price: parsePriceAnchor(product.priceAnchor),
          })),
        },
        buildBreadcrumbSchema(normalizedPath, 'Pricing'),
        buildFaqSchema(pricingPage.faq),
      ].filter(Boolean),
    }
  }

  if (normalizedPath === '/blog') {
    return {
      ...base,
      title: `Resources | ${SITE_DISPLAY_NAME}`,
      description:
        'Planning guides, family camp resources, and original content that supports trustworthy Georgia camp discovery.',
      adsEligible: true,
      schemas: [
        buildCollectionSchema(
          normalizedPath,
          `${SITE_DISPLAY_NAME} resources`,
          'Camp planning guides and seasonal articles'
        ),
        buildBreadcrumbSchema(normalizedPath, 'Resources'),
      ],
    }
  }

  if (segments[0] === 'blog' && segments[1]) {
    const post = blogLookup[segments[1]]
    if (post) {
      return {
        ...base,
        title: `${post.title} | ${SITE_DISPLAY_NAME}`,
        description: post.excerpt ?? SITE_DEFAULT_DESCRIPTION,
        adsEligible: post.adsEligible !== false,
        schemas: [
          buildArticleSchema(post, canonicalUrl),
          buildBreadcrumbSchema(normalizedPath, post.title),
        ].filter(Boolean),
      }
    }
  }

  if (normalizedPath === '/products') {
    return {
      ...base,
      title: `Programs | ${SITE_DISPLAY_NAME}`,
      description:
        'Explore signature Camp Dream GA programs, retreat packages, and planning support lanes.',
      schemas: [
        buildCollectionSchema(
          normalizedPath,
          `${SITE_DISPLAY_NAME} programs`,
          'Programs, retreats, and planning options'
        ),
        buildBreadcrumbSchema(normalizedPath, 'Programs'),
      ],
    }
  }

  if (segments[0] === 'products' && segments[1]) {
    const product = productLookup[segments[1]]
    if (product) {
      return {
        ...base,
        title: `${product.name} | ${SITE_DISPLAY_NAME}`,
        description:
          product.description ?? product.summary ?? SITE_DEFAULT_DESCRIPTION,
        schemas: [
          buildProductSchema(product, canonicalUrl),
          buildBreadcrumbSchema(normalizedPath, product.name),
        ].filter(Boolean),
      }
    }
  }

  if (
    normalizedPath.startsWith('/admin') ||
    normalizedPath.startsWith('/checkout')
  ) {
    return {
      ...base,
      title: `${SITE_DISPLAY_NAME} | Protected route`,
      description: 'Protected operational route.',
      noindex: true,
    }
  }

  if (page) {
    const title = page.headline ?? page.title ?? segments[0]
    return {
      ...base,
      title: `${title} | ${SITE_DISPLAY_NAME}`,
      description: page.subheadline ?? page.intro ?? SITE_DEFAULT_DESCRIPTION,
      adsEligible: page.adsEligible === true,
      schemas: [
        buildBreadcrumbSchema(normalizedPath, title),
        buildFaqSchema(page.faq),
      ].filter(Boolean),
    }
  }

  return {
    ...base,
    noindex: true,
  }
}

export default function SiteSeo() {
  const location = useLocation()

  React.useEffect(() => {
    const seo = getSeoForPath(location.pathname)
    document.title = seo.title
    document.documentElement.lang = 'en'

    ensureMeta('meta[name="description"]', {
      name: 'description',
      content: seo.description,
    })
    ensureMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: seo.title,
    })
    ensureMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: seo.description,
    })
    ensureMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: 'website',
    })
    ensureMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: seo.canonicalUrl,
    })
    ensureMeta('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: SITE_DISPLAY_NAME,
    })
    ensureMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    })
    ensureMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: seo.title,
    })
    ensureMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: seo.description,
    })
    ensureMeta('meta[name="robots"]', {
      name: 'robots',
      content: seo.noindex ? 'noindex, nofollow' : 'index, follow',
    })
    ensureLink('link[rel="canonical"]', {
      rel: 'canonical',
      href: seo.canonicalUrl,
    })

    if (seo.schemas.length > 0) {
      ensureScript('site-structured-data', {
        type: 'application/ld+json',
        textContent: JSON.stringify(seo.schemas),
      })
    } else {
      removeIfPresent('site-structured-data')
    }

    if (ADS_ENABLED && ADSENSE_CLIENT_ID && seo.adsEligible) {
      ensureScript('adsense-loader', {
        async: '',
        crossorigin: 'anonymous',
        src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`,
      })
    } else {
      removeIfPresent('adsense-loader')
    }
  }, [location.pathname])

  return null
}
