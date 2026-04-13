import React from 'react'
import { Navigate, Link, useParams } from 'react-router-dom'
import AdSenseSlot from '../components/AdSenseSlot.jsx'
import { featuredCollections, featuredProducts } from '../src/calistiqueContent.js'

export default function CollectionPage() {
  const { slug } = useParams()
  const collection = featuredCollections.find((item) => item.slug === slug)

  if (!collection) {
    return <Navigate to="/" replace />
  }

  return (
    <article className="shop-detail">
      <section className="shop-detail__hero">
        <div className="shop-detail__media">
          <img src={collection.hero} alt={collection.name} />
          <div className="shop-detail__badge">{collection.tone}</div>
        </div>
        <div className="shop-detail__copy">
          <p className="eyebrow">{collection.price}</p>
          <h1>{collection.name}</h1>
          <p className="section-copy">{collection.copy}</p>
          <div className="hero__actions">
            <Link className="button button--primary" to="/contact">
              Request styling
            </Link>
            <Link className="button button--ghost" to="/">
              Back to shop
            </Link>
          </div>
        </div>
      </section>

      <section className="shop-detail__grid">
        {featuredProducts.slice(0, 3).map((product) => (
          <Link key={product.slug} to={`/shop/${product.slug}`} className="shop-detail__card">
            <p className="eyebrow">Pair with</p>
            <h2>{product.name}</h2>
            <p>{product.accent}</p>
          </Link>
        ))}
      </section>

      <section className="midpage-ad">
        <AdSenseSlot slot="calistique-collection-mid" label="Sponsored style note" />
      </section>
    </article>
  )
}
