import React from 'react'
import AdSenseSlot from '../components/AdSenseSlot.jsx'
import { productCatalog } from '../src/siteData.js'

const products = productCatalog.length
  ? productCatalog
  : [
      {
        slug: 'silk-evening-dress',
        name: 'Silk Evening Dress',
        summary: 'A modern draped silhouette designed for gallery nights and formal events.',
        affiliateUrl: 'https://example.com',
        price: '$219',
        badge: 'Affiliate',
      },
      {
        slug: 'gold-chain-set',
        name: 'Gold Chain Layer Set',
        summary: 'Multi-length stackable chains for elevated day-to-night styling.',
        affiliateUrl: 'https://example.com',
        price: '$129',
        badge: 'Sponsored-ready',
      },
      {
        slug: 'structured-mini-bag',
        name: 'Structured Mini Bag',
        summary: 'Premium hardware and compact form factor for fashion-forward edits.',
        affiliateUrl: 'https://example.com',
        price: '$165',
        badge: 'Best value',
      },
    ]

export default function ProductsPage() {
  return (
    <article className="prose-page tools-page">
      <header className="prose-header">
        <span className="eyebrow">Shop</span>
        <h1>Luxury fashion and jewelry essentials.</h1>
        <p className="prose-lead">
          Calistique combines direct checkout and curated affiliate links so each
          product story can convert into revenue without compromising premium
          editorial presentation.
        </p>
      </header>

      <section className="blog-grid">
        {products.map((product, index) => (
          <article key={product.slug ?? product.name} className="blog-card">
            <span className="meta-line">{product.badge ?? 'Affiliate'}</span>
            <h2>{product.name}</h2>
            <p>{product.summary ?? product.description}</p>
            <strong>{product.price ?? ''}</strong>
            <a
              className="button button--primary"
              href={product.affiliateUrl ?? product.url ?? '#'}
              target="_blank"
              rel="noopener noreferrer sponsored"
            >
              View product
            </a>
            <p className="field-note">
              Affiliate-ready placement. Replace with your CJ affiliate deep link
              or in-house product URL for live commerce.
            </p>
            {index === 1 ? <AdSenseSlot slot="products-inline-1" /> : null}
          </article>
        ))}
      </section>
    </article>
  )
}
