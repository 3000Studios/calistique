import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AIConciergePanel from '../components/AIConciergePanel.jsx'
import ExperiencePathfinder from '../components/ExperiencePathfinder.jsx'
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
  'enterprise-deployment': 2,
}

function formatDate(value) {
  if (!value) {
    return 'Preparing for first live deploy'
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatProviders(providers = []) {
  return providers.length
    ? providers.map((provider) => provider.toUpperCase()).join(' + ')
    : 'Inquiry-first routing'
}

function handleCtaClick(ctaId, intent, offerSlug = '') {
  trackCtaClick({
    ctaId,
    intent,
    offerSlug,
  }).catch(() => {})
}

export default function HomePage() {
  const { snapshot } = useSiteRuntime()
  const liveOffers = [...(snapshot?.commerce?.offers ?? [])].sort(
    (left, right) =>
      (OFFER_ORDER[left.slug] ?? 99) - (OFFER_ORDER[right.slug] ?? 99)
  )
  const latestDeployment = snapshot?.proof?.latestDeployment
  const heroMetrics = homepage.heroStats?.length
    ? homepage.heroStats
    : [
        { label: 'Programs', value: '3 signature lanes' },
        { label: 'Audience', value: 'Families, schools, groups' },
        { label: 'Planning flow', value: 'Direct, guided, custom' },
      ]

  const trustBoard = [
    {
      eyebrow: 'Clarity',
      title: 'Visitors can tell what to do next almost immediately',
      description:
        'The public experience is organized around real decisions: book directly, explore with confidence, or start a guided planning conversation.',
      outcome: 'Lower confusion and stronger intent',
    },
    {
      eyebrow: 'Trust',
      title:
        'Editorial content, legal pages, and polished flows support each other',
      description:
        'The site feels complete instead of sales-only, which helps families trust the brand and supports cleaner publisher readiness.',
      outcome: 'Better SEO and AdSense foundation',
    },
    {
      eyebrow: 'Revenue',
      title: 'Programs, planning support, and resources now share one funnel',
      description:
        'The site no longer treats content, bookings, and higher-touch inquiries like separate products with disconnected next steps.',
      outcome: `${liveOffers.length || productCatalog.length} clear monetization lanes`,
    },
  ]

  const visualStoryCards = [
    {
      eyebrow: 'Family weekends',
      title:
        'Premium guidance for visitors who want confidence before they book',
      body: 'The warm visual system, stronger structure, and calmer hierarchy make the public experience feel more like a premium destination brand.',
    },
    {
      eyebrow: 'Retreat planning',
      title:
        'Custom and group paths stay consultative instead of forcing checkout too early',
      body: 'Larger trips and more complex planning needs deserve qualification-first flows rather than a generic one-size-fits-all purchase pattern.',
    },
    {
      eyebrow: 'Editorial growth',
      title:
        'Resource content supports discovery while ads stay off sensitive flows',
      body: 'Long-form planning content can grow search traffic and future ad revenue without cheapening the booking experience.',
    },
  ]

  const proofMoments = [
    {
      label: 'Payment routing',
      value: formatProviders(snapshot?.proof?.configuredPaymentProviders),
    },
    {
      label: 'Latest deployment',
      value: latestDeployment
        ? `${latestDeployment.status} · ${formatDate(latestDeployment.finishedAt)}`
        : formatDate(null),
    },
    {
      label: 'Commercial lanes',
      value: `${liveOffers.length || productCatalog.length} premium paths`,
    },
  ]

  const quickSignals = [
    'Compare a simple booking with a guided family package',
    'Find the right route for a church or school retreat',
    'Read a helpful guide before committing',
    'Use the concierge when you want a stronger recommendation',
  ]

  return (
    <div className="stack-2xl">
      <motion.section
        className="hero hero--executive"
        variants={staggerParent}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="hero__copy hero__copy--immersive"
          variants={fadeUp}
        >
          <span className="eyebrow">{homepage.eyebrow}</span>
          <PrismHeadline text={homepage.headline} />
          <p className="hero__lede">{homepage.subheadline}</p>
          <div className="tag-row">
            {homepage.operatorSignals.map((signal) => (
              <span key={signal} className="tag">
                {signal}
              </span>
            ))}
          </div>
          <div className="hero__trust-grid">
            {proofMoments.map((item) => (
              <article key={item.label} className="hero-stat-card">
                <span className="meta-line">{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
          <div className="hero__actions">
            <Link
              className="button button--primary"
              to={homepage.primaryCta.to}
              onClick={() =>
                handleCtaClick('home-programs', 'purchase', 'operator-os')
              }
            >
              {homepage.primaryCta.label}
            </Link>
            <Link
              className="button button--ghost"
              to={homepage.secondaryCta.to}
              onClick={() =>
                handleCtaClick(
                  'home-contact',
                  'implementation',
                  'launch-sprint'
                )
              }
            >
              {homepage.secondaryCta.label}
            </Link>
          </div>
        </motion.div>

        <motion.aside
          className="hero__panel hero__panel--story"
          variants={fadeUp}
        >
          <div className="hero__media-frame hero__media-frame--story">
            <div className="hero__video-overlay" />
            <div className="hero-visual__panel">
              <span className="panel-kicker">Featured pathways</span>
              <h2>{homepage.heroPanel.heading}</h2>
              <p>{homepage.heroPanel.body}</p>
              <div className="visual-grid">
                {visualStoryCards.map((item) => (
                  <article key={item.title} className="visual-card">
                    <span className="meta-line">{item.eyebrow}</span>
                    <h3>{item.title}</h3>
                    <p className="visual-card__body">{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div className="command-strip">
            {quickSignals.map((example) => (
              <span key={example} className="command-chip">
                {example}
              </span>
            ))}
          </div>
        </motion.aside>
      </motion.section>

      <MetricStrip items={heroMetrics} />

      <ExperiencePathfinder />

      <section className="section-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Why this feels better</span>
            <h2>
              The public experience now acts like a premium camp and planning
              brand instead of a scattered brochure.
            </h2>
            <p className="section-intro">
              The hierarchy is warmer, the routes are clearer, and the
              monetization model is easier to trust whether someone wants to
              browse, learn, or commit.
            </p>
          </div>
        </div>
        <div className="card-grid card-grid--compact">
          {trustBoard.map((item) => (
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

      {homepage.whyNowCards ? (
        <section className="section-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Revenue architecture</span>
              <h2>{homepage.whyNowHeadline}</h2>
              <p className="section-intro">
                A stronger public site does more than look expensive. It makes
                the relationship between content, trust, checkout, and inquiry
                feel intentional.
              </p>
            </div>
          </div>
          <div className="card-grid card-grid--compact">
            {homepage.whyNowCards.map((item) => (
              <article key={item.title} className="content-card">
                <span className="meta-line">{item.eyebrow}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p className="content-card__outcome">{item.outcome}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Commercial lanes</span>
            <h2>
              Choose the booking path that matches how much support you want.
            </h2>
            <p className="section-intro">
              Every route is explicit: direct booking for simple packages,
              guided planning for families, and qualification first for custom
              group experiences.
            </p>
          </div>
          <Link className="button button--ghost" to="/products">
            View all programs
          </Link>
        </div>
        <div className="card-grid">
          {liveOffers.map((offer) => (
            <OfferCheckoutCard key={offer.slug} offer={offer} />
          ))}
        </div>
      </section>

      <section className="section-card">
        <span className="eyebrow">Planning flow</span>
        <h2>{homepage.workflowHeadline}</h2>
        <div className="card-grid card-grid--compact">
          {homepage.workflowSteps.map((step, index) => (
            <article
              key={step.title}
              className="content-card content-card--step"
            >
              <span className="step-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <RichBlocks
        title="Platform capabilities"
        intro={platformPage.intro}
        items={platformPage.items}
      />
      <RichBlocks
        title="Who this is for"
        intro={homepage.audienceIntro}
        items={homepage.audiences}
      />
      <RichBlocks
        title="Why teams move now"
        intro={homepage.buyerPathsIntro}
        items={homepage.buyerPaths}
      />

      {homepage.founderStory ? (
        <section className="section-card conversion-band">
          <div>
            <span className="eyebrow">{homepage.founderStory.eyebrow}</span>
            <h2>{homepage.founderStory.heading}</h2>
            <p className="section-intro">{homepage.founderStory.body}</p>
          </div>
          <div className="hero__kicker-row">
            {homepage.founderStory.points.map((point) => (
              <article key={point} className="content-card content-card--dense">
                <span className="meta-line">Built for</span>
                <strong>{point}</strong>
              </article>
            ))}
          </div>
        </section>
      ) : null}

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
            onClick={() =>
              handleCtaClick('home-final-programs', 'purchase', 'operator-os')
            }
          >
            {homepage.finalCta.primaryLabel}
          </Link>
          <Link
            className="button button--ghost"
            to={homepage.finalCta.secondaryHref}
            onClick={() =>
              handleCtaClick(
                'home-final-contact',
                'implementation',
                'launch-sprint'
              )
            }
          >
            {homepage.finalCta.secondaryLabel}
          </Link>
        </div>
      </section>
    </div>
  )
}
