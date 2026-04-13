import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import AdSenseIntegration from '../components/AdSenseIntegration.jsx'
import { featuredProducts } from '../src/calistiqueContent.js'

export default function ShopItemPage() {
  const { slug } = useParams()
  const product = featuredProducts.find((item) => item.slug === slug)

  if (!product) {
    return <Navigate to="/" replace />
  }

  return (
    <article className="shop-detail">
      <section className="shop-detail__hero">
        <div className="shop-detail__media">
          <img src={product.image} alt={product.name} />
          <div className="shop-detail__badge">{product.category}</div>
        </div>
        <div className="shop-detail__copy">
          <p className="eyebrow">{product.accent}</p>
          <h1>{product.name}</h1>
          <p className="section-copy">{product.description}</p>
          <div className="hero__actions">
            <a className="button button--primary" href="/contact">
              Request styling
            </a>
            <a className="button button--ghost" href="/">
              Back to shop
            </a>
          </div>
        </div>
      </section>

      <section className="shop-detail__grid">
        <div className="shop-detail__card">
          <h2>Why it sells</h2>
          <p>{product.name} is designed for high intent shoppers who want an easy yes.</p>
        </div>
        <div className="shop-detail__card">
          <h2>Merchandising</h2>
          <p>Pair it with the homepage collection grid and promote it as a featured drop.</p>
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
