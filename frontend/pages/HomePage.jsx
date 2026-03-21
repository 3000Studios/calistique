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
          <span className="eyebrow">{homepage.eyebrow}</span>
          <PrismHeadline text={homepage.headline} />
          <p>{homepage.subheadline}</p>
          <div className="tag-row">
            {homepage.operatorSignals.map((signal) => (
              <span key={signal} className="tag">
                {signal}
              </span>
            ))}
          </div>
          <div className="hero__actions">
            <Link className="button button--primary" to={homepage.primaryCta.to}>
              {homepage.primaryCta.label}
            </Link>
            <Link className="button button--ghost" to={homepage.secondaryCta.to}>
              {homepage.secondaryCta.label}
            </Link>
          </div>
        </motion.div>
        <motion.aside className="hero__panel" variants={fadeUp}>
          <span className="panel-kicker">Revenue model</span>
          <h2>{homepage.heroPanel.heading}</h2>
          <p>{homepage.heroPanel.body}</p>
          <div className="stack-sm hero__signals">
            {homepage.heroPanel.points.map((point) => (
              <div key={point.label} className="commit-row">
                <strong>{point.label}</strong>
                <span>{point.value}</span>
              </div>
            ))}
          </div>
        </motion.aside>
      </motion.section>

      <MetricStrip items={homepage.heroStats} />

      <section className="section-card">
        <span className="eyebrow">How it works</span>
        <h2>{homepage.workflowHeadline}</h2>
        <div className="card-grid card-grid--compact">
          {homepage.workflowSteps.map((step, index) => (
            <article key={step.title} className="content-card content-card--step">
              <span className="step-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <RichBlocks title={featurePage.headline} intro={featurePage.intro} items={featurePage.items} />
      <RichBlocks title="Who it is built for" intro={homepage.audienceIntro} items={homepage.audiences} />

      <section className="section-card">
        <span className="eyebrow">Proof of value</span>
        <h2>{homepage.proofHeadline}</h2>
        <div className="card-grid card-grid--compact">
          {homepage.proofCards.map((item) => (
            <article key={item.title} className="content-card">
              <span className="meta-line">{item.eyebrow}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p className="content-card__outcome">{item.outcome}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Offers</span>
            <h2>{pricingPage.headline}</h2>
            <p className="section-intro">{pricingPage.subheadline}</p>
          </div>
          <Link className="button button--ghost" to="/pricing">
            Full pricing
          </Link>
        </div>
        <div className="card-grid">
          {pricingPage.tiers.map((tier) => (
            <article key={tier.name} className={`content-card pricing-card${tier.featured ? ' pricing-card--featured' : ''}`}>
              <span className="meta-line">{tier.price}</span>
              <h3>{tier.name}</h3>
              <p>{tier.description}</p>
              <ul className="bullet-list">
                {tier.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <RichBlocks title="Ways to buy" intro={homepage.productsIntro} items={productCatalog} />

      <section className="section-card">
        <span className="eyebrow">Frequently asked</span>
        <h2>{homepage.faqHeadline}</h2>
        <div className="card-grid card-grid--compact">
          {homepage.faq.map((item) => (
            <article key={item.question} className="content-card">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card cta-band">
        <div>
          <span className="eyebrow">{homepage.finalCta.eyebrow}</span>
          <h2>{homepage.finalCta.heading}</h2>
          <p className="section-intro">{homepage.finalCta.body}</p>
        </div>
        <div className="hero__actions">
          <Link className="button button--primary" to={homepage.finalCta.primaryHref}>
            {homepage.finalCta.primaryLabel}
          </Link>
          <Link className="button button--ghost" to={homepage.finalCta.secondaryHref}>
            {homepage.finalCta.secondaryLabel}
          </Link>
        </div>
      </section>
    </div>
  )
}
