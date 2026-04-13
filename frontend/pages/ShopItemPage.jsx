import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import AdSenseIntegration from '../components/AdSenseIntegration.jsx'
import { productLookup } from '../src/siteData.js'

export default function ShopItemPage() {
  const { slug } = useParams()
  const product = productLookup[slug]

  if (!product) {
    return <Navigate to="/" replace />
  }

  return (
    <article className="shop-detail">
      <section className="shop-detail__hero">
        <div className="shop-detail__media">
          <div className="shop-detail__badge">{product.badge ?? 'Affiliate'}</div>
        </div>
        <div className="shop-detail__copy">
          <p className="eyebrow">{product.category ?? 'Shop'}</p>
          <h1>{product.name}</h1>
          <p className="section-copy">{product.summary ?? product.description}</p>
          <div className="hero__actions">
            <a
              className="button button--primary"
              href={product.affiliateUrl ?? product.url ?? '/contact'}
              rel="noopener noreferrer sponsored"
              target={product.affiliateUrl || product.url ? '_blank' : undefined}
            >
              View product
            </a>
            <a className="button button--ghost" href="/">
              Back home
            </a>
          </div>
        </div>
      </section>

      <section className="shop-detail__grid">
        <div className="shop-detail__card">
          <h2>Why it sells</h2>
          <p>{product.name} matches recipe intent and earns on relevant traffic.</p>
        </div>
        <div className="shop-detail__card">
          <h2>Merchandising</h2>
          <p>Pair it with recipe and menu pages so the recommendation feels useful.</p>
        </div>
        <div className="shop-detail__card">
          <h2>Ad placement</h2>
          <p>Run contextual display ads around the editorial blocks and above the fold content.</p>
        </div>
      </section>

      <section className="ad-band">
        <AdSenseIntegration />
      </section>
    </article>
  )
}
