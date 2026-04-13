import React from 'react'
import { useLocation } from 'react-router-dom'
import {
  ADSENSE_CLIENT_ID,
  ADS_ENABLED,
  SITE_BRAND,
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_TITLE,
  SITE_DISPLAY_NAME,
  SITE_URL,
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

function getSeoForPath(pathname) {
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
  const canonicalUrl =
    normalizedPath === '/' ? SITE_URL : `${SITE_URL}${normalizedPath}`

  const base = {
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    canonicalUrl,
    noindex: false,
    adsEligible: true,
    schemas: [],
  }

  if (normalizedPath === '/') {
    return {
      ...base,
      title: `${SITE_DISPLAY_NAME} | Premium website revenue system`,
      description:
        'A premium AI system manager for building mobile-first, AdSense-ready, SEO-heavy websites with strict brand isolation.',
      schemas: [
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: SITE_BRAND.legalName,
          url: SITE_BRAND.url,
          sameAs: [SITE_BRAND.url, SITE_BRAND.wwwUrl],
          description: SITE_BRAND.description,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_BRAND.displayName,
          url: SITE_BRAND.url,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_BRAND.url}/blog?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
      ],
    }
  }

  if (normalizedPath.startsWith('/shop/') || normalizedPath.startsWith('/products/')) {
    return {
      ...base,
      title: `${SITE_DISPLAY_NAME} | Product detail`,
      description:
        'Product detail page with conversion-focused layout, premium media, and clear purchase intent.',
    }
  }

  if (normalizedPath === '/blog') {
    return {
      ...base,
      title: `${SITE_DISPLAY_NAME} | Blueprints and editorial content`,
      description:
        'Blueprints, SEO guidance, and monetization systems for premium websites.',
    }
  }

  if (normalizedPath === '/products') {
    return {
      ...base,
      title: `${SITE_DISPLAY_NAME} | Products and offers`,
      description:
        'Curated products and offers presented with a premium, mobile-first merchandising layout.',
    }
  }

  if (normalizedPath === '/revenue') {
    return {
      ...base,
      title: `${SITE_DISPLAY_NAME} | Revenue stack`,
      description:
        'Ads, affiliate loops, lead capture, and conversion paths in one streamlined revenue page.',
    }
  }

  if (normalizedPath === '/adsense-review') {
    return {
      ...base,
      title: `${SITE_DISPLAY_NAME} | AdSense readiness`,
      description:
        'Compliance, policy, and structural checklist for AdSense review.',
    }
  }

  if (normalizedPath === '/privacy' || normalizedPath === '/terms' || normalizedPath === '/contact' || normalizedPath === '/about' || normalizedPath === '/disclosure') {
    return {
      ...base,
      title: `${SITE_DISPLAY_NAME} | ${normalizedPath.slice(1)}`,
      description: `${SITE_DISPLAY_NAME} policy and trust page for visitors and reviewers.`,
    }
  }

  if (normalizedPath.startsWith('/admin')) {
    return {
      ...base,
      title: `${SITE_DISPLAY_NAME} | Protected operator route`,
      description: 'Protected operational route.',
      noindex: true,
      adsEligible: false,
    }
  }

  return {
    ...base,
    noindex: true,
    adsEligible: false,
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
    ensureMeta('meta[name="theme-color"]', {
      name: 'theme-color',
      content: '#090d13',
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
