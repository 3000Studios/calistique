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
      slug: 'drop-001-obsidian',
      to: '/drops/drop-001-obsidian',
      title: 'Obsidian Drop',
      subtitle: 'Drop 001 · Monochrome Essentials',
      description: 'Heavyweight streetwear and statement hardware. Clean silhouettes, premium build.',
    },
    {
      slug: 'jewelry',
      to: '/products?category=Jewelry',
      title: 'Jewelry',
      subtitle: 'Chains, Rings & Stacks',
      description: 'PVD-finished stainless steel. Designed for daily wear and on-camera shine.',
    },
    {
      slug: 'streetwear',
      to: '/products?category=Streetwear',
      title: 'Streetwear',
      subtitle: 'Tees, Hoodies & Cargo',
      description: 'Heavyweight construction, boxy silhouettes, and clean hardware details.',
    },
  ]

  return (
    <div className="page-shell">
      <section className="lux-hero">
        <div className="lux-hero__content">
          <p className="lux-eyebrow">Est. MMXXVI · Luxury Streetwear &amp; Fine Jewellery</p>
          <h1>{SITE_DISPLAY_NAME}</h1>
          <p>
            Premium hardware, elevated essentials, and statement jewellery — curated drops designed
            for the modern wardrobe.
          </p>
          <div className="lux-button-row">
            <Link className="lux-button lux-button--primary" to="/products">
              Shop the drop
            </Link>
            <Link className="lux-button lux-button--ghost" to="/about">
              Our maison
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
            <Link key={collection.slug} className="lux-collection-card" to={collection.to}>
              <div>
                <div className="lux-collection-card__icon" aria-hidden="true" />
                <h3>{collection.title}</h3>
                <p className="lux-eyebrow" style={{ marginBottom: '0.5rem' }}>{collection.subtitle}</p>
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
          <h2>Signature pieces</h2>
        </div>

        <div className="lux-grid-3">
          {featured.map((product) => {
            const image = Array.isArray(product.images) ? product.images[0] : null
            const priceCents = Array.isArray(product.variants) && product.variants[0]?.priceCents
              ? product.variants[0].priceCents
              : 0
            return (
              <Link key={product.slug} className="lux-product-card" to={`/products/${product.slug}`}>
                <div className="lux-product-card__media">
                  {image ? (
                    <img src={image} alt={product.name} loading="lazy" />
                  ) : (
                    <div className="lux-product-card__mediaFallback" aria-hidden="true">✦</div>
                  )}
                  <div className="lux-product-card__overlay">
                    <span className="lux-button lux-button--primary">View product</span>
                  </div>
                </div>
                <div className="lux-product-card__body">
                  <p className="lux-eyebrow">{product.category}</p>
                  <h3>{product.name}</h3>
                  <p className="lux-product-card__caption">{product.description}</p>
                  {priceCents > 0 && (
                    <p className="lux-price">
                      {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(priceCents / 100)}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="lux-section">
        <div className="lux-panel lux-panel--centered">
          <span className="lux-eyebrow">Inner Circle</span>
          <h2>Private previews. First access. Styling notes.</h2>
          <p>
            Join the Calistique list for new drop alerts, fit guides, and early access to limited
            pieces and exclusive offers.
          </p>
          <div className="lux-button-row">
            <Link className="lux-button lux-button--primary" to="/contact">
              Request access
            </Link>
            <Link className="lux-button lux-button--ghost" to="/blog">
              Style notes
            </Link>
          </div>
        </div>
      </section>

      <section className="lux-section">
        <div className="lux-section-heading lux-section-heading--split">
          <div>
            <span className="lux-eyebrow">Style Notes</span>
            <h2>From the journal</h2>
          </div>
          <Link className="lux-button lux-button--ghost" to="/blog">
            All posts →
          </Link>
        </div>
        <div className="lux-grid-3">
          <div className="lux-panel">
            <span className="lux-eyebrow" style={{ display: 'block', marginBottom: '0.75rem' }}>Drop Strategy</span>
            <h3 style={{ fontFamily: 'var(--lux-font-display)', fontSize: '1.55rem', fontWeight: 300, margin: '0 0 0.5rem', color: 'var(--lux-accent)' }}>The OBSIDIAN DROP fit guide</h3>
            <p>Proportions, hardware placement, and layering rules for monochrome dressing.</p>
            <Link className="lux-collection-card__cta" style={{ opacity: 1, display: 'block', marginTop: '0.75rem' }} to="/blog/obsidian-drop-fit-guide">Read more →</Link>
          </div>
          <div className="lux-panel">
            <span className="lux-eyebrow" style={{ display: 'block', marginBottom: '0.75rem' }}>Jewelry</span>
            <h3 style={{ fontFamily: 'var(--lux-font-display)', fontSize: '1.55rem', fontWeight: 300, margin: '0 0 0.5rem', color: 'var(--lux-accent)' }}>Streetwear and jewelry stacking</h3>
            <p>The three clean rules that separate premium stacks from visual noise.</p>
            <Link className="lux-collection-card__cta" style={{ opacity: 1, display: 'block', marginTop: '0.75rem' }} to="/blog/streetwear-jewelry-stacking">Read more →</Link>
          </div>
          <div className="lux-panel">
            <span className="lux-eyebrow" style={{ display: 'block', marginBottom: '0.75rem' }}>Buying Guide</span>
            <h3 style={{ fontFamily: 'var(--lux-font-display)', fontSize: '1.55rem', fontWeight: 300, margin: '0 0 0.5rem', color: 'var(--lux-accent)' }}>Chain layering done right</h3>
            <p>Length, weight, and finish — the rules that make stacks look expensive.</p>
            <Link className="lux-collection-card__cta" style={{ opacity: 1, display: 'block', marginTop: '0.75rem' }} to="/blog/chain-layering-guide">Read more →</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
