import React from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import AdSenseSlot from '../components/AdSenseSlot.jsx'
import ContactLeadForm from '../components/ContactLeadForm.jsx'
import MetricStrip from '../components/MetricStrip.jsx'
import OfferCheckoutCard from '../components/OfferCheckoutCard.jsx'
import PrismHeadline from '../components/PrismHeadline.jsx'
import RichBlocks from '../components/RichBlocks.jsx'
import { trackCtaClick } from '../src/siteApi.js'
import { useSiteRuntime } from '../src/SiteRuntimeContext.jsx'
import { pageLookup } from '../src/siteData.js'
import { SITE_DISPLAY_NAME } from '../src/siteMeta.js'
import NotFoundPage from './NotFoundPage.jsx'

const reserved = new Set(['admin', 'blog', 'products'])

function isExternalHref(href) {
  return (
    typeof href === 'string' &&
    (/^(?:[a-z]+:)?\/\//i.test(href) ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:'))
  )
}

function inferOfferSlug(href) {
  if (typeof href !== 'string') {
    return ''
  }

  if (href.includes('operator-os')) {
    return 'operator-os'
  }
  if (href.includes('launch-sprint') || href === '/contact') {
    return 'launch-sprint'
  }
  if (href.includes('enterprise-deployment')) {
    return 'enterprise-deployment'
  }

  return ''
}

function inferIntent(slug, href) {
  if (typeof href !== 'string') {
    return 'learn_more'
  }

  if (href === '/pricing' || href.includes('operator-os')) {
    return 'purchase'
  }
  if (href === '/contact' || href.includes('launch-sprint')) {
    return slug === 'contact' ? 'contact' : 'implementation'
  }
  if (href.includes('enterprise-deployment')) {
    return 'qualification'
  }

  return 'learn_more'
}

function renderTrackedAction(slug, href, label, variant, ctaId) {
  if (!href || !label) {
    return null
  }

  const onClick = () =>
    trackCtaClick({
      ctaId,
      offerSlug: inferOfferSlug(href),
      intent: inferIntent(slug, href),
    }).catch(() => {})

  if (isExternalHref(href)) {
    return (
      <a className={`button button--${variant}`} href={href} onClick={onClick}>
        {label}
      </a>
    )
  }

  return (
    <Link className={`button button--${variant}`} to={href} onClick={onClick}>
      {label}
    </Link>
  )
}

export default function GenericPage() {
  const { slug } = useParams()
  const { snapshot } = useSiteRuntime()

  if (reserved.has(slug)) {
    return <Navigate to="/" replace />
  }

  const page = pageLookup[slug]

  if (!page) {
    return <NotFoundPage />
  }

  return (
    <div className="stack-2xl">
      <section className="section-card section-card--hero">
        <span className="eyebrow">{page.eyebrow ?? SITE_DISPLAY_NAME}</span>
        <PrismHeadline text={page.headline ?? page.title ?? slug} />
        <p className="section-intro">
          {page.subheadline ??
            page.intro ??
            'This page is managed from the shared content layer.'}
        </p>
      </section>

      {page.heroStats ? <MetricStrip items={page.heroStats} /> : null}

      {page.steps ? (
        <section className="section-card">
          <span className="eyebrow">{page.stepsEyebrow ?? 'Workflow'}</span>
          <h2>{page.stepsHeadline ?? 'How the flow works'}</h2>
          <div className="card-grid card-grid--compact">
            {page.steps.map((step, index) => (
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
      ) : null}

      {slug === 'contact' ? (
        <ContactLeadForm
          interestDefault={
            page.leadForm?.interestDefault ?? 'Family Adventure Weekend'
          }
          ctaId="contact-page-form"
          heading={page.leadForm?.heading}
          intro={page.leadForm?.intro}
          submitLabel={page.leadForm?.submitLabel}
        />
      ) : null}

      {page.sections ? (
        <RichBlocks
          title={page.sectionsHeadline ?? 'What this page covers'}
          items={page.sections}
        />
      ) : null}
      {page.items ? (
        <RichBlocks
          title={page.itemsHeadline ?? 'Core sections'}
          items={page.items}
        />
      ) : null}

      {page.tiers ? (
        <section className="card-grid">
          {page.tiers.map((tier) => (
            <article
              key={tier.name}
              className={`content-card pricing-card${tier.featured ? ' pricing-card--featured' : ''}`}
            >
              <span className="meta-line">{tier.price}</span>
              <h2>{tier.name}</h2>
              <p>{tier.description}</p>
              <ul className="bullet-list">
                {tier.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      ) : null}

      {slug === 'pricing' && snapshot?.commerce?.offers?.length ? (
        <section className="section-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Live checkout</span>
              <h2>Payment buttons reflect real provider readiness.</h2>
              <p className="section-intro">
                Direct payment options appear only when the route is configured.
                Higher-touch experiences continue through the inquiry-first
                planning path.
              </p>
            </div>
          </div>
          <div className="card-grid">
            {snapshot.commerce.offers.map((offer) => (
              <OfferCheckoutCard key={offer.slug} offer={offer} />
            ))}
          </div>
        </section>
      ) : null}

      {page.faq ? (
        <section className="section-card">
          <span className="eyebrow">FAQ</span>
          <h2>{page.faqHeadline ?? 'Questions before you commit'}</h2>
          <div className="card-grid card-grid--compact">
            {page.faq.map((entry) => (
              <article key={entry.question} className="content-card">
                <h3>{entry.question}</h3>
                <p>{entry.answer}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {page.adsEligible ? <AdSenseSlot slot={`page-${slug}-inline`} /> : null}

      {page.cta ? (
        <section className="section-card cta-band">
          <div>
            <span className="eyebrow">{page.cta.eyebrow}</span>
            <h2>{page.cta.heading}</h2>
            <p className="section-intro">{page.cta.body}</p>
          </div>
          <div className="hero__actions">
            {renderTrackedAction(
              slug,
              page.cta.primaryHref,
              page.cta.primaryLabel,
              'primary',
              `page-${slug}-primary`
            )}
            {renderTrackedAction(
              slug,
              page.cta.secondaryHref,
              page.cta.secondaryLabel,
              'ghost',
              `page-${slug}-secondary`
            )}
          </div>
        </section>
      ) : null}
    </div>
  )
}
