import React from 'react'
import { Navigate, Link, useParams } from 'react-router-dom'
import AdSenseIntegration from '../components/AdSenseIntegration.jsx'
import { editorialDrops, featuredCollections } from '../src/calistiqueContent.js'

export default function DropPage() {
  const { slug } = useParams()
  const drop = editorialDrops.find((item) => item.slug === slug)

  if (!drop) {
    return <Navigate to="/" replace />
  }

  return (
    <article className="shop-detail">
      <section className="shop-detail__hero">
        <div className="shop-detail__media">
          <video autoPlay muted loop playsInline className="hero__video">
            <source
              src="https://cdn.coverr.co/videos/coverr-fashion-model-walking-1555683982741?download=1080p"
              type="video/mp4"
            />
          </video>
          <div className="shop-detail__badge">Editorial drop</div>
        </div>
        <div className="shop-detail__copy">
          <p className="eyebrow">Drop</p>
          <h1>{drop.title}</h1>
          <p className="section-copy">{drop.excerpt}</p>
          <div className="hero__actions">
            <Link className="button button--primary" to="/#products">
              Shop the collection
            </Link>
            <Link className="button button--ghost" to="/">
              Back to home
            </Link>
          </div>
        </div>
      </section>

      <section className="shop-detail__grid">
        {featuredCollections.map((collection) => (
          <Link key={collection.slug} to={`/shop/${collection.slug}`} className="shop-detail__card">
            <p className="eyebrow">{collection.tone}</p>
            <h2>{collection.name}</h2>
            <p>{collection.copy}</p>
          </Link>
        ))}
      </section>

      <section className="ad-band">
        <AdSenseIntegration />
      </section>
    </article>
  )
}
