import React, { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { productCatalog, storeDrops } from '../src/siteData.js'

function formatCountdown(targetIso) {
  if (!targetIso) return null
  const diff = new Date(targetIso).getTime() - Date.now()
  if (!Number.isFinite(diff)) return null
  if (diff <= 0) return 'Live now'
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  const remainHours = hours % 24
  return days > 0 ? `${days}d ${remainHours}h` : `${hours}h`
}

export default function DropPage() {
  const { slug } = useParams()
  const drop = storeDrops.find((d) => d.id === slug) ?? null

  const products = useMemo(() => {
    return productCatalog
      .filter((p) => p.dropId === drop?.id)
      .sort((a, b) => (a.featuredRank ?? 999) - (b.featuredRank ?? 999))
  }, [drop?.id])

  if (!drop) {
    return <Navigate to="/" replace />
  }

  const countdown = formatCountdown(drop.launchAt)

  return (
    <article className="prose-page">
      <header className="prose-header">
        <span className="eyebrow">Drop</span>
        <h1>{drop.name}</h1>
        <p className="prose-lead">{drop.tagline}</p>
        {countdown ? <p className="muted">Launch window: {countdown}</p> : null}

        <div className="hero__actions">
          <Link className="button button--primary" to="/products">
            Shop all
          </Link>
          <Link className="button button--ghost" to="/blog">
            Style notes
          </Link>
        </div>
      </header>

      <section className="product-grid">
        {products.map((product) => {
          const image = Array.isArray(product.images) ? product.images[0] : null
          return (
            <article key={product.slug} className="product-card">
              <Link to={`/products/${product.slug}`} className="product-card__media">
                {image ? (
                  <img src={image} alt={product.name} loading="lazy" />
                ) : (
                  <div className="media-fallback" aria-hidden="true" />
                )}
                <div className="product-card__badge">{product.badges?.[0] ?? 'Drop'}</div>
              </Link>
              <div className="product-card__body">
                <h2 className="product-card__title">{product.name}</h2>
                <p className="muted">{product.description}</p>
                <div className="product-card__actions">
                  <Link className="button button--primary" to={`/products/${product.slug}`}>
                    View
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </section>
    </article>
  )
}

