import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { productCatalog } from '../src/siteData.js'
import { SITE_DISPLAY_NAME } from '../src/siteMeta.js'

export default function HomePage() {
  const featured = useMemo(() => {
    return [...productCatalog]
      .sort((a, b) => (a.featuredRank ?? 999) - (b.featuredRank ?? 999))
      .slice(0, 6)
  }, [])

  const collections = [
    {
      slug: 'lumiere',
      title: 'Lumière',
      subtitle: 'Diamond Collection',
      description: 'Refined shine, luminous finishes, and statement detail.',
    },
    {
      slug: 'nocturne',
      title: 'Nocturne',
      subtitle: 'Evening Wear',
      description: 'Monochrome tailoring and after-dark silhouettes.',
    },
    {
      slug: 'eternite',
      title: 'Éternité',
      subtitle: 'Bridal Jewellery',
      description: 'Heirloom mood with a sharper modern profile.',
    },
  ]

  return (
    <div className="page-shell">
      <section className="lux-hero">
        <div className="lux-hero__content">
          <p className="lux-eyebrow">Est. MMXXIV · Luxury Fashion &amp; Fine Jewellery</p>
          <h1>Where Elegance Meets Desire</h1>
          <p>
            {SITE_DISPLAY_NAME} curates drop-driven fashion and fine jewelry for buyers
            who want premium visuals, statement detail, and direct conversion.
          </p>
          <div className="lux-button-row">
            <Link className="lux-button lux-button--primary" to="/products">
              Explore Collection
            </Link>
            <Link className="lux-button lux-button--ghost" to="/drops/drop-001-obsidian">
              Shop Drop
            </Link>
          </div>
        </div>
      </section>

      <section className="lux-section">
        <div className="lux-section-heading">
          <span className="lux-eyebrow">Discover</span>
          <h2>Our Collections</h2>
        </div>

        <div className="lux-grid-3">
          {collections.map((collection) => (
            <Link key={collection.slug} className="lux-collection-card" to="/products">
              <div>
                <div className="lux-collection-card__icon" aria-hidden="true" />
                <h3>{collection.title}</h3>
                <p>{collection.subtitle}</p>
                <p>{collection.description}</p>
                <span className="lux-collection-card__cta">View Collection →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="lux-section">
        <div className="lux-section-heading lux-section-heading--split">
          <div>
            <span className="lux-eyebrow">Featured</span>
            <h2>Best sellers from the current rotation.</h2>
          </div>
          <p>
            Top styles stay front and center while the broader catalog remains indexed
            for search, retention, and repeat purchase.
          </p>
        </div>

        <div className="lux-grid-4">
          {featured.map((product) => {
            const image = Array.isArray(product.images) ? product.images[0] : null
            return (
              <article key={product.slug} className="lux-product-card">
                <Link className="lux-product-card__media" to={`/products/${product.slug}`}>
                  {image ? (
                    <img src={image} alt={product.name} loading="lazy" />
                  ) : (
                    <div className="lux-product-card__mediaFallback" aria-hidden="true">
                      ✦
                    </div>
                  )}
                  <div className="lux-product-card__overlay">
                    <span className="lux-button lux-button--primary">View Product</span>
                  </div>
                </Link>
                <div className="lux-product-card__body">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p className="lux-price">
                    {product.variants?.[0]?.priceCents
                      ? `$${Math.round(product.variants[0].priceCents / 100)}`
                      : ''}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="lux-section">
        <div className="lux-section-heading lux-section-heading--center">
          <span className="lux-eyebrow">Stay Enchanted</span>
          <h2>Join the Inner Circle</h2>
          <p>
            Receive exclusive previews, private sale invitations, and first access to new
            collections.
          </p>
        </div>

        <form className="lux-button-row" onSubmit={(event) => event.preventDefault()}>
          <input className="lux-input" type="email" placeholder="Your email address" aria-label="Email address" />
          <button className="lux-button lux-button--primary" type="submit">
            Subscribe
          </button>
        </form>
      </section>
    </div>
  )
}
