import React, { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { productCatalog } from '../src/siteData.js'
import { useCart } from '../src/cartStore.jsx'

async function beginProviderCheckout(endpoint, items) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ items }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok || !payload?.checkoutUrl) {
    throw new Error(payload?.message || 'Checkout failed.')
  }

  window.location.assign(payload.checkoutUrl)
}

export default function ShopItemPage() {
  const { slug } = useParams()
  const product = useMemo(
    () => productCatalog.find((entry) => entry.slug === slug) ?? null,
    [slug]
  )
  const { addItem } = useCart()
  const variants = Array.isArray(product?.variants) ? product.variants : []
  const [selectedSku, setSelectedSku] = useState(variants[0]?.sku ?? '')
  const [checkoutError, setCheckoutError] = useState('')

  if (!product) {
    return <Navigate to="/" replace />
  }

  const selectedVariant = variants.find((v) => v.sku === selectedSku) ?? null
  const inStock =
    typeof selectedVariant?.stock === 'number' ? selectedVariant.stock > 0 : true
  const image = Array.isArray(product.images) ? product.images[0] : null

  return (
    <article className="page-shell">
      <div className="lux-button-row" style={{ justifyContent: 'flex-start', marginBottom: '1rem' }}>
        <Link className="lux-button lux-button--ghost" to="/products">
          Back to Shop
        </Link>
      </div>

      <section className="lux-detail">
        <div className="lux-detail__image">
          {image ? (
            <img src={image} alt={product.name} loading="eager" />
          ) : (
            <div className="lux-product-card__mediaFallback" aria-hidden="true">
              ✦
            </div>
          )}
        </div>
        <div className="lux-detail__copy">
          <p className="lux-eyebrow">{product.category ?? 'Shop'}</p>
          <h1>{product.name}</h1>
          <div className="lux-detail__meta">
            <span className="lux-price">
              {selectedVariant?.priceCents
                ? new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                  }).format(selectedVariant.priceCents / 100)
                : ''}
            </span>
            <span>{inStock ? 'In stock' : 'Out of stock'}</span>
          </div>
          <p>{product.description}</p>

          <div className="lux-detail__info">
            <label className="lux-eyebrow" htmlFor="variant">
              Variant
            </label>
            <select
              id="variant"
              className="lux-select"
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
            >
              {variants.map((variant) => (
                <option key={variant.sku} value={variant.sku}>
                  {variant.label}
                  {typeof variant.stock === 'number' && variant.stock <= 0
                    ? ' — Sold out'
                    : ''}
                </option>
              ))}
            </select>

            <div className="lux-cta-stack">
              <button
                className="lux-button lux-button--primary"
                disabled={!selectedVariant || !inStock}
                onClick={() => {
                  if (!selectedVariant) return
                  setCheckoutError('')
                  addItem({ slug: product.slug, sku: selectedVariant.sku, quantity: 1 })
                }}
              >
                Add to Bag
              </button>
              <button
                className="lux-button lux-button--ghost"
                disabled={!selectedVariant || !inStock}
                onClick={async () => {
                  if (!selectedVariant) return
                  try {
                    setCheckoutError('')
                    await beginProviderCheckout('/api/checkout/session', [
                      { slug: product.slug, sku: selectedVariant.sku, quantity: 1 },
                    ])
                  } catch (error) {
                    setCheckoutError(error.message)
                  }
                }}
              >
                Buy with Stripe
              </button>
              <button
                className="lux-button lux-button--ghost"
                disabled={!selectedVariant || !inStock}
                onClick={async () => {
                  if (!selectedVariant) return
                  try {
                    setCheckoutError('')
                    await beginProviderCheckout('/api/paypal/checkout', [
                      { slug: product.slug, sku: selectedVariant.sku, quantity: 1 },
                    ])
                  } catch (error) {
                    setCheckoutError(error.message)
                  }
                }}
              >
                Buy with PayPal
              </button>
            </div>

            {checkoutError ? <p className="form-error">{checkoutError}</p> : null}

            <div className="lux-detail__facts">
              <div className="lux-detail__fact">
                <span className="lux-eyebrow">Category</span>
                <span>{product.category}</span>
              </div>
              <div className="lux-detail__fact">
                <span className="lux-eyebrow">Shipping</span>
                <span>{product.shippingBlurb}</span>
              </div>
              <div className="lux-detail__fact">
                <span className="lux-eyebrow">Returns</span>
                <span>{product.returnsBlurb}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lux-grid-3 lux-section">
        <div className="lux-panel">
          <h2>Materials</h2>
          <p>{Array.isArray(product.materials) ? product.materials.join(' · ') : ''}</p>
        </div>
        <div className="lux-panel">
          <h2>Care</h2>
          <p>{product.care}</p>
        </div>
        <div className="lux-panel">
          <h2>Drop</h2>
          <p>{product.dropId ? `Part of ${product.dropId}.` : 'Core add-on.'}</p>
        </div>
      </section>
    </article>
  )
}
