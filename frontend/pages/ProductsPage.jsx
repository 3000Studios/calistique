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
      return 'Guided implementation'
    case 'qualification':
      return 'Qualified rollout'
    default:
      return 'Guided close'
  }
}

export default function ProductsPage() {
  const { snapshot } = useSiteRuntime()
  const runtimeMetrics = [
    { label: 'Live offers', value: String(snapshot?.commerce?.offers?.length ?? productCatalog.length) },
    { label: 'Checkout-ready lanes', value: String(snapshot?.proof?.checkoutReadyOffers ?? 0) },
    { label: 'Payment routing', value: snapshot?.proof?.configuredPaymentProviders?.length ? snapshot.proof.configuredPaymentProviders.join(' + ') : 'PayPal email redirect' }
  ]

  return (
    <div className="stack-2xl">
      <section className="section-card section-card--hero">
        <span className="eyebrow">Offers</span>
        <PrismHeadline text={`Ways to buy ${SITE_DISPLAY_NAME}`} />
        <p className="section-intro">
          The commercial model is now cleaner: checkout when the buyer is ready, implementation when they need help, and enterprise review when rollout needs governance.
        </p>
      </section>

      <MetricStrip items={runtimeMetrics} />

      <section className="card-grid">
        {productCatalog.map((product) => (
          <article key={product.slug} className="content-card product-card">
            <span className="meta-line">{product.priceAnchor}</span>
            <h2>{product.name}</h2>
            <p>{product.summary}</p>
            <div className="tag-row">
              <span className="tag">{formatCloseMode(productLookup[product.slug]?.closeMode)}</span>
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
                  intent: productLookup[product.slug]?.closeMode === 'checkout'
                    ? 'purchase'
                    : productLookup[product.slug]?.closeMode === 'qualification'
                      ? 'qualification'
                      : 'implementation'
                }).catch(() => {})
              }
            >
              View details
            </Link>
          </article>
        ))}
      </section>

      <section className="section-card cta-band">
        <div>
          <span className="eyebrow">Fastest path</span>
          <h2>Start with pricing if you already know the fit, or start with contact if you want guidance.</h2>
          <p className="section-intro">
            The whole redesign is built to reduce the amount of dead-end navigation between conviction and action.
          </p>
        </div>
        <div className="hero__actions">
          <Link
            className="button button--primary"
            to="/pricing"
            onClick={() => trackCtaClick({ ctaId: 'products-pricing', offerSlug: 'operator-os', intent: 'purchase' }).catch(() => {})}
          >
            Open pricing
          </Link>
          <Link
            className="button button--ghost"
            to="/contact"
            onClick={() => trackCtaClick({ ctaId: 'products-contact', offerSlug: 'launch-sprint', intent: 'implementation' }).catch(() => {})}
          >
            Start implementation brief
          </Link>
        </div>
      </section>
    </div>
  )
}
