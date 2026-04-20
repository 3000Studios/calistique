import React, { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { productCatalog } from '../src/siteData.js'
import { useCart } from '../src/cartStore.jsx'

export default function ShopItemPage() {
  const { slug } = useParams()
  const product = useMemo(
    () => productCatalog.find((entry) => entry.slug === slug) ?? null,
    [slug]
  )
  const { addItem } = useCart()
  const variants = Array.isArray(product?.variants) ? product.variants : []
  const [selectedSku, setSelectedSku] = useState(variants[0]?.sku ?? '')

  if (!product) {
    return <Navigate to="/" replace />
  }

  const selectedVariant = variants.find((v) => v.sku === selectedSku) ?? null
  const inStock =
    typeof selectedVariant?.stock === 'number' ? selectedVariant.stock > 0 : true
  const image = Array.isArray(product.images) ? product.images[0] : null

  return (
    <article className="shop-detail">
      <section className="shop-detail__hero">
        <div className="shop-detail__media">
          {image ? (
            <img src={image} alt={product.name} loading="eager" />
          ) : (
            <div className="media-fallback" aria-hidden="true" />
          )}
          <div className="shop-detail__badge">
            {product.badges?.[0] ?? (inStock ? 'Available' : 'Sold out')}
          </div>
        </div>
        <div className="shop-detail__copy">
          <p className="eyebrow">{product.category ?? 'Shop'}</p>
          <h1>{product.name}</h1>
          <p className="section-copy">{product.description}</p>

          <div className="product-detail__panel">
            <label className="muted" htmlFor="variant">
              Variant
            </label>
            <select
              id="variant"
              className="input"
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

            <div className="product-detail__meta">
              <span className="muted">
                {inStock ? 'In stock' : 'Out of stock'}
              </span>
              {selectedVariant?.priceCents ? (
                <strong>
                  {new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                  }).format(selectedVariant.priceCents / 100)}
                </strong>
              ) : null}
            </div>

            <div className="hero__actions">
              <button
                className="button button--primary"
                disabled={!selectedVariant || !inStock}
                onClick={() => {
                  if (!selectedVariant) return
                  addItem({ slug: product.slug, sku: selectedVariant.sku, quantity: 1 })
                }}
              >
                Add to cart
              </button>
              <Link className="button button--ghost" to="/products">
                Back to shop
              </Link>
            </div>

            <p className="muted">{product.shippingBlurb}</p>
            <p className="muted">{product.returnsBlurb}</p>
          </div>
        </div>
      </section>

      <section className="shop-detail__grid">
        <div className="shop-detail__card">
          <h2>Materials</h2>
          <p>{Array.isArray(product.materials) ? product.materials.join(' · ') : ''}</p>
        </div>
        <div className="shop-detail__card">
          <h2>Care</h2>
          <p>{product.care}</p>
        </div>
        <div className="shop-detail__card">
          <h2>Drop</h2>
          <p>{product.dropId ? `Part of ${product.dropId}.` : 'Core add-on.'}</p>
        </div>
      </section>
    </article>
  )
}
