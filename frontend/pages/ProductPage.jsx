import React from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import ContactLeadForm from '../components/ContactLeadForm.jsx'
import OfferCheckoutCard from '../components/OfferCheckoutCard.jsx'
import PrismHeadline from '../components/PrismHeadline.jsx'
import RichBlocks from '../components/RichBlocks.jsx'
import { trackCtaClick } from '../src/siteApi.js'
import { useSiteRuntime } from '../src/SiteRuntimeContext.jsx'
import { productLookup } from '../src/siteData.js'

function formatCloseMode(closeMode) {
  switch (closeMode) {
    case 'checkout':
      return 'Checkout first'
    case 'lead':
      return 'Lead form first'
    case 'qualification':
      return 'Qualification first'
    default:
      return 'Guided close'
  }
}

export default function ProductPage() {
  const { slug } = useParams()
  const product = productLookup[slug]
  const { snapshot } = useSiteRuntime()
  const liveOffer = snapshot?.commerce?.offers?.find((offer) => offer.slug === slug) ?? null
  const closeMode = product?.closeMode ?? liveOffer?.closeMode ?? 'checkout'

  if (!product) {
    return <Navigate to="/products" replace />
  }

  return (
    <div className="stack-xl">
      <section className="section-card">
        <span className="eyebrow">{product.eyebrow ?? 'Offer'}</span>
        <PrismHeadline text={product.headline ?? product.name} />
        <p className="section-intro">{product.description ?? product.summary}</p>
        <div className="tag-row">
          <span className="tag">{product.priceAnchor}</span>
          <span className="tag">{formatCloseMode(closeMode)}</span>
          {product.idealFor ? <span className="tag">{product.idealFor}</span> : null}
        </div>
      </section>

      {closeMode === 'checkout' && liveOffer ? <OfferCheckoutCard offer={liveOffer} /> : null}
      {closeMode !== 'checkout' ? (
        <ContactLeadForm
          interestDefault={product.name}
          ctaId={`${slug}-brief-form`}
          heading={product.leadForm?.heading ?? `Start the ${product.name} brief`}
          intro={product.leadForm?.intro ?? 'Use this form to describe the outcome, timeline, and implementation details before the next step is scoped.'}
          submitLabel={product.leadForm?.submitLabel ?? `Submit ${product.name} brief`}
        />
      ) : null}

      {product.bullets ? (
        <section className="section-card">
          <h2>What it unlocks</h2>
          <ul className="bullet-list">
            {product.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {product.proofPoints ? (
        <RichBlocks
          title="Proof and readiness"
          intro="This offer earns trust through observable product capability, runtime signals, and the close path it is designed to use."
          items={product.proofPoints}
        />
      ) : null}
      {product.deliverables ? <RichBlocks title="Deliverables" items={product.deliverables} /> : null}
      {product.qualificationChecks ? <RichBlocks title="Qualification checks" items={product.qualificationChecks} /> : null}
      {product.sections ? <RichBlocks title="Included in the offer" items={product.sections} /> : null}
      {product.timeline ? (
        <section className="section-card">
          <span className="eyebrow">Timeline</span>
          <h2>How this path moves from interest to execution</h2>
          <div className="card-grid card-grid--compact">
            {product.timeline.map((step, index) => (
              <article key={step.title} className="content-card content-card--step">
                <span className="step-number">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {product.cta ? (
        <section className="section-card cta-band">
          <div>
            <span className="eyebrow">{product.cta.eyebrow}</span>
            <h2>{product.cta.heading}</h2>
            <p className="section-intro">{product.cta.body}</p>
          </div>
          <div className="hero__actions">
            <Link
              className="button button--primary"
              to={product.cta.primaryHref}
              onClick={() =>
                trackCtaClick({
                  ctaId: `product-${slug}-primary`,
                  offerSlug: slug,
                  intent: closeMode === 'checkout' ? 'purchase' : closeMode === 'qualification' ? 'qualification' : 'implementation'
                }).catch(() => {})
              }
            >
              {product.cta.primaryLabel}
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  )
}
