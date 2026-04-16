import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AdSenseSlot from '../components/AdSenseSlot.jsx'
import AdSenseIntegration from '../components/AdSenseIntegration.jsx'
import { homepage, platformPage, pricingPage } from '../src/siteData.js'
import { SITE_CATEGORY } from '../src/siteMeta.js'

function useClickTone() {
  return useMemo(() => {
    return () => {
      if (typeof window === 'undefined') return
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      const context = new AudioContext()
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'triangle'
      oscillator.frequency.value = 420
      gain.gain.value = 0.0001
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.start()
      gain.gain.exponentialRampToValueAtTime(0.025, context.currentTime + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.09)
      oscillator.stop(context.currentTime + 0.1)
    }
  }, [])
}

const trustSignals = [
  'Luxury visual storytelling and product-first UX',
  'SEO, ads, analytics, and legal foundations in place',
  'Stripe, PayPal, and affiliate-ready checkout paths',
  'Mobile-first layout tuned for fashion discovery',
]

export default function HomePage() {
  const [showLeadModal, setShowLeadModal] = useState(false)
  const clickTone = useClickTone()

  useEffect(() => {
    const timer = setTimeout(() => setShowLeadModal(true), 45000)
    return () => clearTimeout(timer)
  }, [])

  const heroStats =
    homepage.heroStats?.length > 0
      ? homepage.heroStats
      : [
          { label: 'Brand truth', value: '1:1' },
          { label: 'SEO stack', value: 'On' },
          { label: 'AdSense', value: 'Ready' },
        ]

  return (
    <div className="calistique-home portfolio-home">
      <section className="hero portfolio-hero">
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
                Calistique: high-fashion and jewelry that converts.
              </span>
            </h1>
            <p className="hero__lede">
              A premium commerce experience for elevated apparel and jewelry,
              combining editorial aesthetics with conversion-ready monetization
              and secure checkout options.
            </p>
          </div>

          <div className="hero__actions">
            <a className="button button--primary" href="#workflow" onClick={clickTone}>
              View the collection formula
            </a>
            <Link className="button button--ghost" to="/adsense-review" onClick={clickTone}>
              AdSense checklist
            </Link>
          </div>

          <div className="hero__proof-grid">
            {trustSignals.map((item) => (
              <article key={item} className="hero-stat-card">
                <p className="eyebrow">Trust block</p>
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
              poster="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600"
            >
              <source
                src="https://cdn.coverr.co/videos/coverr-person-typing-on-laptop-1554215903971?download=1080p"
                type="video/mp4"
              />
            </video>
            <div className="hero__video-overlay">
              <p className="eyebrow">Flagship home</p>
              <strong>Runway-inspired visual hierarchy with clear product and checkout CTAs.</strong>
            </div>
          </div>

          <div className="hero__kicker-row">
            {heroStats.map((stat) => (
              <article key={stat.label} className="hero-stat-card">
                <p>{stat.label}</p>
                <strong>{stat.value}</strong>
              </article>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="ad-band">
        <AdSenseIntegration />
      </section>

      <section className="hero-metrics">
        {[
          ['SEO', 'Canonical tags, schema, sitemap, robots, and social tags'],
          ['Revenue', 'Ads, direct checkout, affiliate offers, and editorial funnels'],
          ['Performance', 'Lazy media, elegant motion, and mobile-first layout'],
        ].map(([label, text]) => (
          <article key={label} className="hero-metric">
            <p>{label}</p>
            <strong>{text}</strong>
          </article>
        ))}
      </section>

      <section id="workflow" className="collections">
        <div className="section-heading">
          <p className="eyebrow">Operating system</p>
          <h2>Luxury brand rules with scalable commerce architecture.</h2>
        </div>

        <div className="collection-grid">
          {[
            {
              title: 'Identity lock',
              copy: 'Brand, domain, and storefront metadata stay perfectly aligned.',
            },
            {
              title: 'Editorial shell',
              copy: 'Award-style visual depth, polished type, premium color, and responsive motion.',
            },
            {
              title: 'Monetization layer',
              copy: 'AdSense-ready structure with affiliate, CJ, and direct checkout conversion paths.',
            },
          ].map((item, index) => (
            <motion.article
              key={item.title}
              className="collection-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.08 }}
            >
              <p>Step {index + 1}</p>
              <h3>{item.title}</h3>
              <span>{item.copy}</span>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="midpage-ad">
        <AdSenseSlot slot="portfolio-home-mid" label="Sponsored placement" />
      </section>

      <section className="products">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Site system</p>
            <h2>Build one elite storefront system, then scale curated drops.</h2>
          </div>
          <p className="section-copy">
            Maintain high-end visual quality while keeping speed, SEO, and
            monetization performance consistent across the storefront.
          </p>
        </div>

        <div className="product-grid">
          {(platformPage.items?.length ? platformPage.items : pricingPage.tiers ?? []).slice(0, 4).map((item, index) => (
            <motion.article
              key={item.name ?? item.title ?? index}
              className="product-card"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="product-card__meta">
                <div>
                  <h3>{item.name ?? item.title}</h3>
                  <p>{item.description ?? item.copy ?? 'Reusable site standard'}</p>
                </div>
                <strong>{item.price ?? item.value ?? 'Ready'}</strong>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="signup">
        <div className="signup__panel">
          <div>
            <p className="eyebrow">Lead capture</p>
            <h2>Editorial newsletters, alerts, and recurring traffic loops.</h2>
            <p>
              Collect high-intent subscribers for drop announcements, style
              edits, and affiliate partner campaigns.
            </p>
          </div>
          <form className="signup__form">
            <input type="email" placeholder="Email address" aria-label="Email address" />
            <button type="submit">Join list</button>
          </form>
        </div>
      </section>

      {showLeadModal && (
        <div className="lead-modal" role="dialog" aria-modal="true">
          <div className="lead-modal__card">
            <p className="eyebrow">Before you go</p>
            <h2>Get Calistique drop alerts first.</h2>
            <p>
              Join the list for early access to limited drops, jewelry edits,
              and curated partner offers.
            </p>
            <div className="hero__actions">
              <button
                className="button button--primary"
                type="button"
                onClick={() => setShowLeadModal(false)}
              >
                Subscribe
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
