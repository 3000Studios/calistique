import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { productCatalog } from '../src/siteData.js'
import { SITE_CATEGORY, SITE_DISPLAY_NAME } from '../src/siteMeta.js'

const trustSignals = [
  'Secure Stripe Checkout',
  '1–3 business day shipping',
  '30-day returns (unworn)',
  'Drop-first merchandising',
]

export default function HomePage() {
  const [showLeadModal, setShowLeadModal] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowLeadModal(true), 45000)
    return () => clearTimeout(timer)
  }, [])

  const featured = useMemo(() => {
    return [...productCatalog]
      .sort((a, b) => (a.featuredRank ?? 999) - (b.featuredRank ?? 999))
      .slice(0, 6)
  }, [])

  const categories = useMemo(() => {
    const counts = new Map()
    for (const product of productCatalog) {
      const key = product.category ?? 'Other'
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count]) => ({ name, count }))
  }, [])

  return (
    <div className="calistique-home">
      <section className="hero hero--store">
        <motion.div
          className="hero__copy hero__copy--immersive"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="stack-md">
            <p className="eyebrow">{SITE_CATEGORY}</p>
            <h1 className="prism-headline">
              <span className="prism-headline__text">
                {SITE_DISPLAY_NAME}. Built for the drop.
              </span>
            </h1>
            <p className="hero__lede">
              Luxury streetwear and statement jewelry engineered for clean
              silhouettes, premium hardware, and conversion-first product pages.
            </p>
          </div>

          <div className="hero__actions">
            <Link className="button button--primary" to="/drops/drop-001-obsidian">
              Shop Drop
            </Link>
            <Link className="button button--ghost" to="/products">
              New arrivals
            </Link>
          </div>

          <div className="hero__proof-grid">
            {trustSignals.map((item) => (
              <article key={item} className="hero-stat-card">
                <p className="eyebrow">Standard</p>
                <strong>{item}</strong>
              </article>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="hero__panel hero__panel--story"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.08 }}
        >
          <div className="hero__media-frame">
            <video
              className="hero__video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="https://images.pexels.com/photos/845434/pexels-photo-845434.jpeg?auto=compress&cs=tinysrgb&w=1600"
            >
              <source
                src="https://cdn.coverr.co/videos/coverr-a-person-poses-while-wearing-sunglasses-8492/1080p.mp4"
                type="video/mp4"
              />
            </video>
            <div className="hero__video-overlay">
              <p className="eyebrow">Drop 001</p>
              <strong>OBSIDIAN — monochrome essentials with hardware that hits.</strong>
            </div>
          </div>

          <div className="hero__kicker-row">
            <article className="hero-stat-card">
              <p>Featured</p>
              <strong>Limited quantities</strong>
            </article>
            <article className="hero-stat-card">
              <p>Checkout</p>
              <strong>Stripe</strong>
            </article>
            <article className="hero-stat-card">
              <p>Shipping</p>
              <strong>1–3 days</strong>
            </article>
          </div>
        </motion.div>
      </section>

      <section className="collections">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Shop by category</p>
            <h2>Build the fit. Stack the hardware.</h2>
          </div>
          <p className="section-copy">
            Categories are curated so the catalog stays premium, fast, and easy to buy.
          </p>
        </div>

        <div className="collection-grid">
          {categories.map((item, index) => (
            <motion.article
              key={item.name}
              className="collection-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.08 }}
            >
              <p>{item.count} items</p>
              <h3>{item.name}</h3>
              <span>Explore the category in the Shop.</span>
              <Link className="button button--ghost" to="/products">
                Browse
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="products">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Featured</p>
            <h2>Best sellers from the current drop.</h2>
          </div>
          <p className="section-copy">
            Designed for clean silhouettes and camera-ready shine.
          </p>
        </div>

        <div className="product-grid">
          {featured.map((product, index) => (
            <motion.article
              key={product.slug}
              className="product-card"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="product-card__meta">
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </div>
                <Link className="button button--primary" to={`/products/${product.slug}`}>
                  View
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="signup">
        <div className="signup__panel">
          <div>
            <p className="eyebrow">Early access</p>
            <h2>Get drop alerts before the sell-out.</h2>
            <p>Subscribe for early access, restocks, and limited bundles.</p>
          </div>
          <form className="signup__form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Email address" aria-label="Email address" />
            <button type="submit">Join list</button>
          </form>
        </div>
      </section>

      {showLeadModal && (
        <div className="lead-modal" role="dialog" aria-modal="true">
          <div className="lead-modal__card">
            <p className="eyebrow">Before you go</p>
            <h2>Want early access?</h2>
            <p>
              Get drop alerts, bundle offers, and private restock windows.
            </p>
            <div className="hero__actions">
              <button
                className="button button--primary"
                type="button"
                onClick={() => setShowLeadModal(false)}
              >
                Join list
              </button>
              <button
                className="button button--ghost"
                type="button"
                onClick={() => setShowLeadModal(false)}
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

