import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import MetricStrip from '../components/MetricStrip.jsx'
import RichBlocks from '../components/RichBlocks.jsx'
import { fadeUp, staggerParent } from '../animations/variants.js'
import { featurePage, homepage, pricingPage, productCatalog } from '../src/siteData.js'

export default function HomePage() {
  return (
    <div className="stack-xl">
      <motion.section className="hero" variants={staggerParent} initial="hidden" animate="visible">
        <motion.div className="hero__copy" variants={fadeUp}>
          <span className="eyebrow">AI revenue engine</span>
          <h1>{homepage.headline}</h1>
          <p>{homepage.subheadline}</p>
          <div className="hero__actions">
            <Link className="button button--primary" to="/products">
              Explore products
            </Link>
            <Link className="button button--ghost" to="/pricing">
              Review plans
            </Link>
          </div>
        </motion.div>
        <motion.aside className="hero__panel" variants={fadeUp}>
          <span className="panel-kicker">Revenue loops</span>
          <h2>Content, conversion, and deploy automation in one repo</h2>
          <p>Ship campaigns, products, and SEO pages from structured commands backed by local models and git history.</p>
        </motion.aside>
      </motion.section>

      <MetricStrip items={homepage.heroStats} />
      <RichBlocks title="System modules" intro={featurePage.intro} items={homepage.sections} />
      <RichBlocks title={featurePage.headline} items={featurePage.items} />
      <RichBlocks title="Revenue products" items={productCatalog} />

      <section className="section-card cta-band">
        <div>
          <span className="eyebrow">Monetization</span>
          <h2>{pricingPage.headline}</h2>
        </div>
        <Link className="button button--primary" to="/pricing">
          Review plans
        </Link>
      </section>
    </div>
  )
}
