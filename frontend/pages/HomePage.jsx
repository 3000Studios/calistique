import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AdSenseSlot from '../components/AdSenseSlot.jsx'
import AdSenseIntegration from '../components/AdSenseIntegration.jsx'
import { editorialDrops, featuredCollections, featuredProducts } from '../src/calistiqueContent.js'
import './HomePage.css'

export default function HomePage() {
  return (
    <div className="calistique-home">
      <section className="hero">
        <div className="hero__glow hero__glow--left" />
        <div className="hero__glow hero__glow--right" />

        <motion.div
          className="hero__content"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow">Calistique</p>
          <h1>High fashion with editorial restraint.</h1>
          <p className="hero__lede">
            A luxury storefront for clothing, jewelry, and premium accessories built to sell fast and look sharp on any screen.
          </p>

          <div className="hero__actions">
            <a className="button button--primary" href="#products">Shop best sellers</a>
            <Link className="button button--ghost" to="/contact">Private styling</Link>
          </div>

          <div className="hero__proof">
            <span>Free shipping over $150</span>
            <span>30-day returns</span>
            <span>Gift-ready packaging</span>
            <span>New drops every week</span>
          </div>
        </motion.div>

        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="hero__video-shell">
            <video
              className="hero__video"
              autoPlay
              muted
              loop
              playsInline
              poster="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80"
            >
              <source
                src="https://cdn.coverr.co/videos/coverr-a-woman-in-a-black-dress-1555683961140?download=1080p"
                type="video/mp4"
              />
            </video>
            <div className="hero__video-overlay">
              <span>Editorial motion</span>
              <strong>Looped video, cinematic lighting, and premium texture.</strong>
            </div>
          </div>

          <div className="hero__reel">
            {featuredCollections.map((collection) => (
              <Link key={collection.slug} to={`/shop/${collection.slug}`} className="hero__reel-card">
                <img src={collection.hero} alt={collection.name} />
                <div>
                  <span>{collection.tone}</span>
                  <strong>{collection.name}</strong>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="ad-band">
        <AdSenseIntegration />
      </section>

      <section className="midpage-ad">
        <AdSenseSlot slot="calistique-home-mid" label="Sponsored collection" />
      </section>

      <section className="collections">
        <div className="section-heading">
          <p className="eyebrow">Collections</p>
          <h2>Curated around silhouette, not noise.</h2>
        </div>

        <div className="collection-grid">
          {featuredCollections.map((collection, index) => (
            <motion.article
              key={collection.name}
              className="collection-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.08 }}
            >
              <Link to={`/shop/${collection.slug}`} className="collection-card__link">
                <img src={collection.hero} alt={collection.name} />
                <p>{collection.tone}</p>
                <h3>{collection.name}</h3>
                <span>{collection.copy}</span>
                <strong>{collection.price}</strong>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="products" className="products">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Best sellers</p>
            <h2>The products customers will actually want to buy.</h2>
          </div>
          <p className="section-copy">
            A focused catalog of clothing, jewelry, and accessories with strong margins, repeatable styling, and premium visual language.
          </p>
        </div>

        <div className="product-grid">
          {featuredProducts.map((product, index) => (
            <motion.article
              key={product.name}
              className="product-card"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.08 }}
            >
              <Link to={`/shop/${product.slug}`} className="product-card__image">
                <img src={product.image} alt={product.name} />
                <span>{product.category}</span>
              </Link>
              <div className="product-card__meta">
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.accent}</p>
                </div>
                <strong>{product.price}</strong>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="editorial">
        {editorialDrops.map((item) => (
          <Link key={item.slug} to={`/drops/${item.slug}`} className="editorial-card">
            <p className="eyebrow">Drop</p>
            <h3>{item.title}</h3>
            <p>{item.excerpt}</p>
          </Link>
        ))}
      </section>

      <section className="signup">
        <div className="signup__panel">
          <div>
            <p className="eyebrow">Launch list</p>
            <h2>Get first access to new drops.</h2>
            <p>Fresh content and product pages are added from the same catalog source.</p>
          </div>
          <form className="signup__form">
            <input type="email" placeholder="Email address" aria-label="Email address" />
            <button type="submit">Join list</button>
          </form>
        </div>
      </section>
    </div>
  )
}
