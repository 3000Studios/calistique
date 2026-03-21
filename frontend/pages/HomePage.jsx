import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import MetricStrip from '../components/MetricStrip.jsx'
import OfferCheckoutCard from '../components/OfferCheckoutCard.jsx'
import PrismHeadline from '../components/PrismHeadline.jsx'
import RichBlocks from '../components/RichBlocks.jsx'
import { fadeUp, staggerParent } from '../animations/variants.js'
import { useSiteRuntime } from '../src/SiteRuntimeContext.jsx'
import { trackCtaClick } from '../src/siteApi.js'
import { featurePage, homepage, productCatalog } from '../src/siteData.js'

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
  if (!providers.length) {
    return 'No live payment providers configured yet'
  }

  return providers.map((provider) => provider.toUpperCase()).join(' + ')
}

function buildProofCards(snapshot) {
  const analytics = snapshot?.analytics ?? {}
  const proof = snapshot?.proof ?? {}
  const contentCounts = proof.contentCounts ?? {}
  const deployment = proof.latestDeployment

  return [
    {
      eyebrow: 'Live funnel data',
      title: 'Visitors, leads, and revenue are derived from recorded system files',
      description: 'The site only reports what the repo-backed event, lead, and payment documents can prove right now.',
      outcome: `${analytics.visitors ?? 0} visitors · ${analytics.leads ?? 0} leads · ${formatCurrency(analytics.revenue ?? 0)} revenue`
    },
    {
      eyebrow: 'Payment readiness',
      title: 'Checkout only appears when a real provider is configured',
      description: 'Operator OS can go straight into live checkout, while service and enterprise offers keep the safer lead or qualification path.',
      outcome: `${proof.checkoutReadyOffers ?? 0} checkout-ready offers · ${formatProviders(proof.configuredPaymentProviders)}`
    },
    {
      eyebrow: 'Operational proof',
      title: 'The content, admin, and model surfaces are part of the same running system',
      description: 'What buyers see on the public funnel is backed by the same repo, admin queue, and runtime that operators use internally.',
      outcome: `${contentCounts.pages ?? 0} pages · ${contentCounts.blog ?? 0} posts · ${contentCounts.products ?? 0} products · ${proof.modelsOnline ?? 0} models online`
    },
    {
      eyebrow: 'Release visibility',
      title: 'Deployments stay visible instead of becoming unverifiable claims',
      description: 'The trust layer is stronger when release history and system readiness can be inspected from the runtime snapshot.',
      outcome: deployment ? `${deployment.status} · ${formatDate(deployment.finishedAt)}` : 'No deployment recorded yet'
    }
  ]
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
  const proofCards = buildProofCards(snapshot)
  const runtimeSignals = [
    {
      label: 'Configured payments',
      value: formatProviders(snapshot?.proof?.configuredPaymentProviders)
    },
    {
      label: 'Checkout-ready offers',
      value: String(snapshot?.proof?.checkoutReadyOffers ?? 0)
    },
    {
      label: 'Contact close mode',
      value: snapshot?.funnel?.contactMode === 'lead_form' ? 'Lead form first' : 'Direct booking'
    },
    {
      label: 'Latest deployment',
      value: snapshot?.proof?.latestDeployment
        ? `${snapshot.proof.latestDeployment.status} · ${formatDate(snapshot.proof.latestDeployment.finishedAt)}`
        : 'No deployment recorded yet'
    }
  ]
  const liveOffers = [...(snapshot?.commerce?.offers ?? [])].sort(
    (left, right) => (OFFER_ORDER[left.slug] ?? 99) - (OFFER_ORDER[right.slug] ?? 99)
  )
  const liveMetrics = [
    { label: 'Visitors tracked', value: String(snapshot?.analytics?.visitors ?? 0) },
    { label: 'Leads captured', value: String(snapshot?.analytics?.leads ?? 0) },
    { label: 'Payments closed', value: String(snapshot?.analytics?.purchases ?? 0) },
    { label: 'Revenue recorded', value: formatCurrency(snapshot?.analytics?.revenue ?? 0) }
  ]

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
            <Link
              className="button button--primary"
              to={homepage.primaryCta.to}
              onClick={() => handleCtaClick('home-primary-pricing', 'purchase', 'operator-os')}
            >
              {homepage.primaryCta.label}
            </Link>
            <Link
              className="button button--ghost"
              to={homepage.secondaryCta.to}
              onClick={() => handleCtaClick('home-secondary-contact', 'implementation', 'launch-sprint')}
            >
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

      <MetricStrip items={liveMetrics} />

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

      <RichBlocks title="Choose the buying lane" intro={homepage.buyerPathsIntro} items={homepage.buyerPaths} />

      <section className="section-card">
        <span className="eyebrow">Proof of value</span>
        <h2>{homepage.proofHeadline}</h2>
        <div className="card-grid card-grid--compact">
          {proofCards.map((item) => (
            <article key={item.title} className="content-card">
              <span className="meta-line">{item.eyebrow}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p className="content-card__outcome">{item.outcome}</p>
            </article>
          ))}
        </div>
      </section>

      {liveOffers.length ? (
        <section className="section-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Live revenue lanes</span>
              <h2>Let each offer close the way it should</h2>
              <p className="section-intro">
                Operator OS stays checkout-first, Launch Sprint stays lead-form-first, and Enterprise stays qualification-first. The buttons only reflect real provider readiness and real routing paths.
              </p>
            </div>
            <Link
              className="button button--ghost"
              to="/pricing"
              onClick={() => handleCtaClick('home-live-offers-pricing', 'purchase')}
            >
              Open pricing
            </Link>
          </div>
          <div className="card-grid">
            {liveOffers.map((offer) => (
              <OfferCheckoutCard key={offer.slug} offer={offer} />
            ))}
          </div>
        </section>
      ) : (
        <section className="section-card">
          <span className="eyebrow">Revenue lanes</span>
          <h2>Offer routing is active even before checkout providers are configured</h2>
          <p className="section-intro">
            Buyers can still move into the right path through pricing, product pages, and the implementation brief while payment providers remain unconfigured.
          </p>
        </section>
      )}

      <RichBlocks title={homepage.whyNowHeadline} items={homepage.whyNowCards} />
      <RichBlocks title="Offer outcomes" intro={homepage.productsIntro} items={productCatalog} />
      <RichBlocks title={featurePage.headline} intro={featurePage.intro} items={featurePage.items} />
      <RichBlocks title="Who it is built for" intro={homepage.audienceIntro} items={homepage.audiences} />

      <section className="section-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{homepage.founderStory.eyebrow}</span>
            <h2>{homepage.founderStory.heading}</h2>
            <p className="section-intro">{homepage.founderStory.body}</p>
          </div>
        </div>
        <div className="card-grid">
          <article className="content-card">
            <span className="meta-line">What exists today</span>
            <h3>Trust comes from the system that is already running</h3>
            <ul className="bullet-list">
              {homepage.founderStory.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
          <article className="content-card">
            <span className="meta-line">Runtime proof</span>
            <h3>Signals the product can show right now</h3>
            <div className="stack-sm">
              {runtimeSignals.map((signal) => (
                <div key={signal.label} className="commit-row">
                  <strong>{signal.label}</strong>
                  <span>{signal.value}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section-card">
        <span className="eyebrow">Objection handling</span>
        <h2>{homepage.objectionHeadline}</h2>
        <div className="card-grid card-grid--compact">
          {homepage.objections.map((item) => (
            <article key={item.question} className="content-card">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

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
