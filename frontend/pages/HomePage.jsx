import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AIConciergePanel from '../components/AIConciergePanel.jsx'
import MetricStrip from '../components/MetricStrip.jsx'
import OfferCheckoutCard from '../components/OfferCheckoutCard.jsx'
import PrismHeadline from '../components/PrismHeadline.jsx'
import RichBlocks from '../components/RichBlocks.jsx'
import { fadeUp, staggerParent } from '../animations/variants.js'
import { useSiteRuntime } from '../src/SiteRuntimeContext.jsx'
import { trackCtaClick } from '../src/siteApi.js'
import { homepage, platformPage, productCatalog } from '../src/siteData.js'

const OFFER_ORDER = {
  'operator-os': 0,
  'launch-sprint': 1,
  'enterprise-deployment': 2
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount)
}

function formatDate(value) {
  if (!value) {
    return 'No deployment recorded yet'
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}

function formatProviders(providers = []) {
  return providers.length ? providers.map((provider) => provider.toUpperCase()).join(' + ') : 'PayPal email redirect'
}

function handleCtaClick(ctaId, intent, offerSlug = '') {
  trackCtaClick({
    ctaId,
    intent,
    offerSlug
  }).catch(() => {})
}

export default function HomePage() {
  const { snapshot } = useSiteRuntime()
  const liveOffers = [...(snapshot?.commerce?.offers ?? [])].sort(
    (left, right) => (OFFER_ORDER[left.slug] ?? 99) - (OFFER_ORDER[right.slug] ?? 99)
  )
  const latestDeployment = snapshot?.proof?.latestDeployment
  const runtimeMetrics = [
    { label: 'Visitors tracked', value: String(snapshot?.analytics?.visitors ?? 0) },
    { label: 'Leads captured', value: String(snapshot?.analytics?.leads ?? 0) },
    { label: 'Purchases recorded', value: String(snapshot?.analytics?.purchases ?? 0) },
    { label: 'Revenue tracked', value: formatCurrency(snapshot?.analytics?.revenue ?? 0) }
  ]
  const operationsBoard = [
    {
      eyebrow: 'Payments',
      title: 'Checkout stays visible and honest',
      description: 'Stripe and PayPal only light up when the routing is actually available, including the PayPal email fallback.',
      outcome: formatProviders(snapshot?.proof?.configuredPaymentProviders)
    },
    {
      eyebrow: 'Deployment',
      title: 'Release status is part of the product story',
      description: 'Builds, git pushes, and operator actions stay observable instead of becoming vague promises.',
      outcome: latestDeployment ? `${latestDeployment.status} · ${formatDate(latestDeployment.finishedAt)}` : 'No deployment recorded yet'
    },
    {
      eyebrow: 'Offers',
      title: 'Three commercial lanes, one coherent system',
      description: 'Software, implementation, and enterprise deployment all map to distinct close paths in the same UI.',
      outcome: `${liveOffers.length || productCatalog.length} active offers`
    }
  ]
  const commandExamples = [
    'Refresh the homepage story for a new offer',
    'Trigger a deploy from the admin operator console',
    'Route a buyer from pricing into implementation',
    'Use the custom GPT concierge to answer buying questions'
  ]

  return (
    <div className="stack-2xl">
      <motion.section className="hero hero--executive" variants={staggerParent} initial="hidden" animate="visible">
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
            <Link
              className="button button--primary"
              to={homepage.primaryCta.to}
              onClick={() => handleCtaClick('home-pricing', 'purchase', 'operator-os')}
            >
              {homepage.primaryCta.label}
            </Link>
            <Link
              className="button button--ghost"
              to={homepage.secondaryCta.to}
              onClick={() => handleCtaClick('home-contact', 'implementation', 'launch-sprint')}
            >
              {homepage.secondaryCta.label}
            </Link>
          </div>
        </motion.div>

        <motion.aside className="hero__panel hero__panel--dashboard" variants={fadeUp}>
          <span className="panel-kicker">Operator board</span>
          <h2>{homepage.heroPanel.heading}</h2>
          <p>{homepage.heroPanel.body}</p>
          <div className="board-list">
            {homepage.heroPanel.points.map((point) => (
              <article key={point.label} className="board-card">
                <strong>{point.label}</strong>
                <p>{point.value}</p>
              </article>
            ))}
          </div>
          <div className="command-strip">
            {commandExamples.map((example) => (
              <span key={example} className="command-chip">
                {example}
              </span>
            ))}
          </div>
        </motion.aside>
      </motion.section>

      <MetricStrip items={runtimeMetrics} />

      <section className="section-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">What changed</span>
            <h2>One cleaner product story now runs the site, admin console, payments, and deployment lane.</h2>
            <p className="section-intro">
              The experience is intentionally more premium, faster to scan, and easier to act on whether you are buying, operating, or shipping.
            </p>
          </div>
        </div>
        <div className="card-grid card-grid--compact">
          {operationsBoard.map((item) => (
            <article key={item.title} className="content-card">
              <span className="meta-line">{item.eyebrow}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p className="content-card__outcome">{item.outcome}</p>
            </article>
          ))}
        </div>
      </section>

      <AIConciergePanel />

      <section className="section-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Commercial lanes</span>
            <h2>Buy the way you actually want to buy.</h2>
            <p className="section-intro">
              Every route is explicit: direct checkout for software, guided implementation for setup-heavy work, and qualification first for enterprise rollout.
            </p>
          </div>
          <Link className="button button--ghost" to="/products">
            View all offers
          </Link>
        </div>
        <div className="card-grid">
          {liveOffers.map((offer) => (
            <OfferCheckoutCard key={offer.slug} offer={offer} />
          ))}
        </div>
      </section>

      <section className="section-card">
        <span className="eyebrow">Execution stack</span>
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

      <RichBlocks title="Platform capabilities" intro={platformPage.intro} items={platformPage.items} />
      <RichBlocks title="Who this is for" intro={homepage.audienceIntro} items={homepage.audiences} />
      <RichBlocks title="Why teams move now" intro={homepage.buyerPathsIntro} items={homepage.buyerPaths} />

      <section className="section-card cta-band">
        <div>
          <span className="eyebrow">{homepage.finalCta.eyebrow}</span>
          <h2>{homepage.finalCta.heading}</h2>
          <p className="section-intro">{homepage.finalCta.body}</p>
        </div>
        <div className="hero__actions">
          <Link
            className="button button--primary"
            to={homepage.finalCta.primaryHref}
            onClick={() => handleCtaClick('home-final-pricing', 'purchase', 'operator-os')}
          >
            {homepage.finalCta.primaryLabel}
          </Link>
          <Link
            className="button button--ghost"
            to={homepage.finalCta.secondaryHref}
            onClick={() => handleCtaClick('home-final-contact', 'implementation', 'launch-sprint')}
          >
            {homepage.finalCta.secondaryLabel}
          </Link>
        </div>
      </section>
    </div>
  )
}
