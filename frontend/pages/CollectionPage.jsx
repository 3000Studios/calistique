import React from 'react'
import { Navigate, Link, useParams } from 'react-router-dom'
import AdSenseSlot from '../components/AdSenseSlot.jsx'
import { productCatalog } from '../src/siteData.js'

export default function CollectionPage() {
  const { slug } = useParams()
  const categoryName = String(slug ?? '').replace(/-/g, ' ')
  const normalized = categoryName.toLowerCase()
  const products = productCatalog.filter(
    (p) => String(p.category ?? '').toLowerCase() === normalized
  )

  if (!products.length) {
    return <Navigate to="/" replace />
  }

  return (
    <article className="shop-detail">
      <section className="shop-detail__hero">
        <div className="shop-detail__media">
          <video autoPlay muted loop playsInline className="hero__video">
            <source
              src="https://cdn.coverr.co/videos/coverr-a-model-in-a-jacket-1535/1080p.mp4"
              type="video/mp4"
            />
          </video>
          <div className="shop-detail__badge">Collection</div>
        </div>
        <div className="shop-detail__copy">
          <p className="eyebrow">Category</p>
          <h1>{categoryName}</h1>
          <p className="section-copy">
            Curated pieces designed to stack cleanly and convert fast.
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" to="/products">
              Shop all
            </Link>
            <Link className="button button--ghost" to="/drops/drop-001-obsidian">
              Shop drop
            </Link>
          </div>
        </div>
      </section>

      <section className="shop-detail__grid">
        {products.slice(0, 6).map((product) => (
          <Link
            key={product.slug}
            to={`/products/${product.slug}`}
            className="shop-detail__card"
          >
            <p className="eyebrow">{product.badges?.[0] ?? 'Featured'}</p>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
          </Link>
        ))}
      </section>

      <section className="midpage-ad">
        <AdSenseSlot slot="calistique-collection-mid" label="Sponsored style note" />
      </section>
    </article>
  )
}
