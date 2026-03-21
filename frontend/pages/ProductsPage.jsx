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
      return 'Checkout first'
    case 'lead':
      return 'Lead form first'
    case 'qualification':
      return 'Qualification first'
    default:
      return 'Guided close'
  }
}

export default function ProductsPage() {
  const { snapshot } = useSiteRuntime()
  const runtimeMetrics = [
    { label: 'Live offers', value: String(snapshot?.commerce?.offers?.length ?? productCatalog.length) },
    { label: 'Checkout-ready offers', value: String(snapshot?.proof?.checkoutReadyOffers ?? 0) },
    { label: 'Contact mode', value: snapshot?.funnel?.contactMode === 'lead_form' ? 'Lead form first' : 'Direct booking' }
  ]

  return (
    <div className="stack-xl">
      <section className="section-card">
        <span className="eyebrow">Productized revenue</span>
        <PrismHeadline text={`Ways to buy ${SITE_DISPLAY_NAME}`} />
        <p className="section-intro">
          The strongest business here is a hybrid close: checkout-first software, lead-form-first implementation,
          and qualification-first enterprise rollout.
        </p>
      </section>

      <MetricStrip items={runtimeMetrics} />

      <section className="card-grid">
        {productCatalog.map((product) => (
          <article key={product.slug} className="content-card">
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
          <span className="eyebrow">Need the shortest path?</span>
          <h2>Go straight to pricing if you are self-serve, or submit a brief if you want guidance.</h2>
          <p className="section-intro">
            Operator OS is built to close quickly, while Launch Sprint and Enterprise are built to protect fit before follow-up.
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
