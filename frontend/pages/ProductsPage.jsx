import React from 'react'
import { Link } from 'react-router-dom'
import MetricStrip from '../components/MetricStrip.jsx'
import PrismHeadline from '../components/PrismHeadline.jsx'
import { trackCtaClick } from '../src/siteApi.js'
import { useSiteRuntime } from '../src/SiteRuntimeContext.jsx'
import { productCatalog, productLookup } from '../src/siteData.js'
import { SITE_DISPLAY_NAME } from '../src/siteMeta.js'

function formatCloseMode(closeMode) {
  switch (closeMode) {
    case 'checkout':
      return 'Direct checkout'
    case 'lead':
      return 'Guided planning'
    case 'qualification':
      return 'Qualification first'
    default:
      return 'Guided path'
  }
}

function inferIntent(closeMode) {
  switch (closeMode) {
    case 'checkout':
      return 'purchase'
    case 'qualification':
      return 'qualification'
    default:
      return 'implementation'
  }
}

export default function ProductsPage() {
  const { snapshot } = useSiteRuntime()
  const runtimeMetrics = [
    {
      label: 'Live offers',
      value: String(
        snapshot?.commerce?.offers?.length ?? productCatalog.length
      ),
    },
    {
      label: 'Checkout-ready lanes',
      value: String(snapshot?.proof?.checkoutReadyOffers ?? 0),
    },
    {
      label: 'Payment routing',
      value: snapshot?.proof?.configuredPaymentProviders?.length
        ? snapshot.proof.configuredPaymentProviders.join(' + ')
        : 'Payment links + inquiry routing',
    },
  ]

  return (
    <div className="stack-2xl">
      <section className="section-card section-card--hero product-hero">
        <div className="product-hero__content stack-lg">
          <span className="eyebrow">Programs</span>
          <PrismHeadline
            text={`Choose the ${SITE_DISPLAY_NAME} path that matches your trip`}
          />
          <p className="section-intro">
            The public booking model is intentionally split into three premium
            lanes: fast booking when the fit is obvious, guided planning when
            families want support, and custom coordination for larger groups.
          </p>
          <div className="tag-row">
            <span className="tag">Direct booking only where it fits</span>
            <span className="tag">Planning support for higher-touch trips</span>
            <span className="tag">Custom retreat qualification for groups</span>
          </div>
        </div>

        <aside className="product-hero__aside stack-md">
          <span className="panel-kicker">How to use this page</span>
          <div className="product-hero__panel">
            <strong>Book fast</strong>
            <p className="field-note">
              Use the direct path when you already know the fit and want the
              shortest route into checkout.
            </p>
          </div>
          <div className="product-hero__panel">
            <strong>Plan carefully</strong>
            <p className="field-note">
              Choose the guided family lane when experience quality matters more
              than speed alone.
            </p>
          </div>
          <div className="product-hero__panel">
            <strong>Scope something custom</strong>
            <p className="field-note">
              Use the group lane when timing, people, and logistics make a
              qualification-first flow the better choice.
            </p>
          </div>
        </aside>
      </section>

      <MetricStrip items={runtimeMetrics} />

      <section className="card-grid">
        {productCatalog.map((product) => {
          const closeMode = productLookup[product.slug]?.closeMode
          return (
            <article
              key={product.slug}
              className="content-card product-card product-card--premium"
            >
              <span className="meta-line">{product.priceAnchor}</span>
              <h2>{product.name}</h2>
              <p>{product.summary}</p>
              <div className="tag-row">
                <span className="tag">{formatCloseMode(closeMode)}</span>
                <span className="tag">{product.idealFor}</span>
              </div>
              <p className="content-card__outcome">{product.outcome}</p>
              <Link
                className="button button--ghost"
                to={`/products/${product.slug}`}
                onClick={() =>
                  trackCtaClick({
                    ctaId: `products-${product.slug}`,
                    offerSlug: product.slug,
                    intent: inferIntent(closeMode),
                  }).catch(() => {})
                }
              >
                View details
              </Link>
            </article>
          )
        })}
      </section>

      <section className="section-card conversion-band">
        <div>
          <span className="eyebrow">Decision helper</span>
          <h2>
            When the fit is obvious, go to pricing. When the trip needs context,
            start the planning conversation.
          </h2>
          <p className="section-intro">
            The strongest premium flow is not about forcing checkout everywhere.
            It is about matching the action to the complexity of the decision.
          </p>
        </div>
        <div className="hero__actions">
          <Link
            className="button button--primary"
            to="/pricing"
            onClick={() =>
              trackCtaClick({
                ctaId: 'products-pricing',
                offerSlug: 'operator-os',
                intent: 'purchase',
              }).catch(() => {})
            }
          >
            Open pricing
          </Link>
          <Link
            className="button button--ghost"
            to="/contact"
            onClick={() =>
              trackCtaClick({
                ctaId: 'products-contact',
                offerSlug: 'launch-sprint',
                intent: 'implementation',
              }).catch(() => {})
            }
          >
            Start planning inquiry
          </Link>
        </div>
      </section>
    </div>
  )
}
