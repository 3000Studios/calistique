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

function formatMoney(cents) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100)
}

export default function ShopItemPage() {
  const { slug } = useParams()
  const product = useMemo(() => productCatalog.find((p) => p.slug === slug) ?? null, [slug])
  const { addItem } = useCart()
  const variants = useMemo(() => Array.isArray(product?.variants) ? product.variants : [], [product])
  const [selectedSku, setSelectedSku] = useState(variants[0]?.sku ?? '')
  const [checkoutError, setCheckoutError] = useState('')
  const [activeMedia, setActiveMedia] = useState(0)

  const crossSell = useMemo(() => {
    if (!product?.crossSell?.length) return []
    return product.crossSell
      .map((s) => productCatalog.find((p) => p.slug === s))
      .filter(Boolean)
      .slice(0, 3)
  }, [product])

  if (!product) return <Navigate to="/" replace />

  const selectedVariant = variants.find((v) => v.sku === selectedSku) ?? null
  const inStock = typeof selectedVariant?.stock === 'number' ? selectedVariant.stock > 0 : true
  const images = Array.isArray(product.images) ? product.images : []
  const hasVideo = Boolean(product.video)

  const allMedia = hasVideo
    ? [{ type: 'video', src: product.video }, ...images.map((src) => ({ type: 'image', src }))]
    : images.map((src) => ({ type: 'image', src }))

  const currentMedia = allMedia[activeMedia] ?? allMedia[0]

  return (
    <article className="page-shell">
      <div className="lux-button-row" style={{ justifyContent: 'flex-start', marginBottom: '1rem' }}>
        <Link className="lux-button lux-button--ghost" to="/products">← Back to Shop</Link>
      </div>

      <section className="lux-detail">
        <div className="lux-detail__image">
          {currentMedia?.type === 'video' ? (
            <video
              key={currentMedia.src}
              autoPlay
              muted
              loop
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
            >
              <source src={currentMedia.src} type="video/mp4" />
            </video>
          ) : currentMedia?.src ? (
            <img src={currentMedia.src} alt={product.name} loading="eager" />
          ) : (
            <div className="lux-product-card__mediaFallback" aria-hidden="true">✦</div>
          )}

          {allMedia.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
              {allMedia.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMedia(i)}
                  style={{
                    width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden',
                    border: i === activeMedia ? '2px solid #c9a96e' : '2px solid transparent',
                    cursor: 'pointer', padding: 0, background: '#111',
                  }}
                  aria-label={m.type === 'video' ? 'Product video' : `Product image ${i + 1}`}
                >
                  {m.type === 'video' ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a96e', fontSize: '18px' }}>▶</div>
                  ) : (
                    <img src={m.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lux-detail__copy">
          <p className="lux-eyebrow">{product.category ?? 'Shop'}</p>
          <h1>{product.name}</h1>

          {Array.isArray(product.badges) && product.badges.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {product.badges.map((b) => (
                <span key={b} style={{ fontSize: '11px', background: '#1a1a1a', color: '#c9a96e', padding: '2px 8px', borderRadius: '3px', letterSpacing: '.08em' }}>{b}</span>
              ))}
            </div>
          )}

          <div className="lux-detail__meta">
            <span className="lux-price" style={{ fontSize: '1.6rem', fontWeight: 700 }}>
              {selectedVariant?.priceCents ? formatMoney(selectedVariant.priceCents) : ''}
            </span>
            <span style={{ color: inStock ? '#6ee47a' : '#e46e6e', fontSize: '13px' }}>
              {inStock ? '✓ In stock' : '✗ Out of stock'}
            </span>
          </div>

          <p style={{ margin: '12px 0 20px', color: '#aaa', lineHeight: 1.6 }}>{product.description}</p>

          <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
            {product.fulfillment ?? 'Merchant fulfilled.'} · Secure checkout with Stripe and PayPal.
          </p>

          <div className="lux-detail__info">
            <label className="lux-eyebrow" htmlFor="variant">Select variant</label>
            <select
              id="variant"
              className="lux-select"
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              style={{ marginBottom: '16px' }}
            >
              {variants.map((v) => (
                <option key={v.sku} value={v.sku}>
                  {v.label}{typeof v.stock === 'number' && v.stock <= 0 ? ' — Sold out' : ''}
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
                style={{ border: '1px solid #635bff' }}
                onClick={async () => {
                  if (!selectedVariant) return
                  setCheckoutError('')
                  try {
                    await beginProviderCheckout('/api/checkout/session', [{ slug: product.slug, sku: selectedVariant.sku, quantity: 1 }])
                  } catch (err) { setCheckoutError(err.message) }
                }}
              >
                Buy with Stripe
              </button>
              <button
                className="lux-button lux-button--ghost"
                disabled={!selectedVariant || !inStock}
                style={{ border: '1px solid #0070ba' }}
                onClick={async () => {
                  if (!selectedVariant) return
                  setCheckoutError('')
                  try {
                    await beginProviderCheckout('/api/paypal/checkout', [{ slug: product.slug, sku: selectedVariant.sku, quantity: 1 }])
                  } catch (err) { setCheckoutError(err.message) }
                }}
              >
                Buy with PayPal
              </button>
            </div>

            {checkoutError ? <p className="form-error" style={{ marginTop: '8px' }}>{checkoutError}</p> : null}

            <div className="lux-detail__facts" style={{ marginTop: '24px' }}>
              <div className="lux-detail__fact"><span className="lux-eyebrow">Category</span><span>{product.category}</span></div>
              <div className="lux-detail__fact"><span className="lux-eyebrow">Shipping</span><span>{product.shippingBlurb}</span></div>
              <div className="lux-detail__fact"><span className="lux-eyebrow">Returns</span><span>{product.returnsBlurb}</span></div>
              <div className="lux-detail__fact"><span className="lux-eyebrow">Seller</span><span>{product.seller ?? 'Calistique.xyz'}</span></div>
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

      {crossSell.length > 0 && (
        <section className="lux-section">
          <div className="lux-section-heading">
            <span className="lux-eyebrow">Complete the look</span>
            <h2>Pairs well with</h2>
          </div>
          <div className="lux-grid-3">
            {crossSell.map((p) => {
              const img = Array.isArray(p.images) ? p.images[0] : null
              const price = Array.isArray(p.variants) && p.variants[0]?.priceCents ? formatMoney(p.variants[0].priceCents) : ''
              return (
                <Link key={p.slug} className="lux-product-card" to={`/products/${p.slug}`}>
                  <div className="lux-product-card__media">
                    {img ? <img src={img} alt={p.name} loading="lazy" /> : <div className="lux-product-card__mediaFallback" aria-hidden="true">✦</div>}
                    <div className="lux-product-card__overlay">
                      <span className="lux-button lux-button--primary">View</span>
                    </div>
                  </div>
                  <div className="lux-product-card__copy">
                    <h3 className="lux-product-card__name">{p.name}</h3>
                    <span className="lux-product-card__price">{price}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </article>
  )
}
