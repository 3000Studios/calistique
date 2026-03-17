import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import MetricStrip from '../components/MetricStrip.jsx'
import PrismHeadline from '../components/PrismHeadline.jsx'
import RichBlocks from '../components/RichBlocks.jsx'
import { fadeUp, staggerParent } from '../animations/variants.js'
import { featurePage, homepage, pricingPage, productCatalog } from '../src/siteData.js'

export default function HomePage() {
  return (
    <div className="stack-xl">
      <motion.section className="hero" variants={staggerParent} initial="hidden" animate="visible">
        <motion.div className="hero__copy" variants={fadeUp}>
          <span className="eyebrow">Hyper-viscous control plane</span>
          <PrismHeadline text={homepage.headline} />
          <p>{homepage.subheadline}</p>
          <div className="tag-row">
            <span className="tag">/engine intent routing</span>
            <span className="tag">/scripts execution flow</span>
            <span className="tag">/dashboard operator UI</span>
          </div>
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
          <span className="panel-kicker">System modules</span>
          <h2>Content, commits, deploys, and agent workflows move through one chrome shell.</h2>
          <p>
            Translate natural language into routed tasks, execute them against the workspace, and surface the
            results through a site that looks like the command center itself.
          </p>
          <div className="stack-sm hero__signals">
            <div className="commit-row">
              <strong>/api</strong>
              <span>Backend endpoints and action handoff</span>
            </div>
            <div className="commit-row">
              <strong>/workers</strong>
              <span>Automation agents and scheduled loops</span>
            </div>
            <div className="commit-row">
              <strong>/content</strong>
              <span>JSON-controlled public pages and products</span>
            </div>
          </div>
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
