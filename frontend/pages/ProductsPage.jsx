import React from 'react'
import AdSenseSlot from '../components/AdSenseSlot.jsx'
import { productCatalog } from '../src/siteData.js'

const products = productCatalog.length
  ? productCatalog
  : [
      {
        slug: 'cast-iron-skillet',
        name: 'Cast Iron Skillet',
        summary: 'A durable skillet for roux, cornbread, and high-heat searing.',
        affiliateUrl: 'https://example.com',
        price: '$39',
        badge: 'Affiliate',
      },
      {
        slug: 'cajun-seasoning-kit',
        name: 'Cajun Seasoning Kit',
        summary: 'A blend bundle for gumbo, jambalaya, and blackened dishes.',
        affiliateUrl: 'https://example.com',
        price: '$24',
        badge: 'Sponsored-ready',
      },
      {
        slug: 'dutch-oven',
        name: 'Enameled Dutch Oven',
        summary: 'Ideal for low-and-slow gumbo, stews, and rice dishes.',
        affiliateUrl: 'https://example.com',
        price: '$79',
        badge: 'Best value',
      },
    ]

export default function ProductsPage() {
  return (
    <article className="prose-page tools-page">
      <header className="prose-header">
        <span className="eyebrow">Shop</span>
        <h1>Products that fit the menu.</h1>
        <p className="prose-lead">
          Use relevant cookware, spice kits, and meal helpers so the site earns
          on the same pages that bring in food traffic.
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
            {index === 1 ? <AdSenseSlot slot="products-inline-1" /> : null}
          </article>
        ))}
      </section>
    </article>
  )
}
