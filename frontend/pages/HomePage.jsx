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
          <p className="lux-eyebrow">Luxury streetwear &amp; statement jewelry</p>
          <h1>{SITE_DISPLAY_NAME}</h1>
          <p>
            Drop-driven essentials, premium hardware, and a conversion-first storefront built for modern
            luxury.
          </p>
          <div className="lux-button-row">
            <Link className="lux-button lux-button--primary" to="/products">
              Shop products
            </Link>
            <Link className="lux-button lux-button--ghost" to="/blog">
              Read the blog
            </Link>
          </div>
        </div>
      </section>

      <section className="lux-section">
        <div className="lux-section-heading">
          <span className="lux-eyebrow">Discover</span>
          <h2>Collections</h2>
        </div>

        <div className="lux-grid-3">
          {collections.map((collection) => (
            <Link key={collection.slug} className="lux-collection-card" to="/products">
              <div>
                <div className="lux-collection-card__icon" aria-hidden="true" />
                <h3>{collection.title}</h3>
                <p>{collection.subtitle}</p>
                <p>{collection.description}</p>
                <span className="lux-collection-card__cta">View collection →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="lux-section">
        <div className="lux-section-heading">
          <span className="lux-eyebrow">Featured</span>
          <h2>Drop picks</h2>
        </div>

        <div className="lux-grid-3">
          {featured.map((product) => (
            <Link key={product.slug} className="lux-product-preview" to={`/products/${product.slug}`}>
              <div className="lux-product-preview__media" aria-hidden="true" />
              <div className="lux-product-preview__body">
                <p className="lux-eyebrow">{product.category}</p>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <span className="lux-product-preview__cta">View product →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
