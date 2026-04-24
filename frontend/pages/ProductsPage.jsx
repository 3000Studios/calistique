import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { productCatalog } from '../src/siteData.js'
import { useCart } from '../src/cartStore.jsx'

function formatMoney(cents, currency = 'USD') {
  const amount = (Number(cents ?? 0) || 0) / 100
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

function lowestVariantPriceCents(product) {
  const variants = Array.isArray(product?.variants) ? product.variants : []
  const prices = variants.map((variant) => variant.priceCents).filter((value) => typeof value === 'number')
  return prices.length ? Math.min(...prices) : 0
}

export default function ProductsPage() {
  const { addItem } = useCart()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('featured')

  const categories = useMemo(() => {
    const unique = new Set(productCatalog.map((product) => product.category).filter(Boolean))
    return ['All', ...Array.from(unique)]
  }, [])

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const matches = productCatalog.filter((product) => {
      if (category !== 'All' && product.category !== category) return false
      if (!normalizedQuery) return true
      return (
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        String(product.category ?? '').toLowerCase().includes(normalizedQuery)
      )
    })

    const sorters = {
      featured: (a, b) => (a.featuredRank ?? 999) - (b.featuredRank ?? 999),
      'price-low': (a, b) => lowestVariantPriceCents(a) - lowestVariantPriceCents(b),
      'price-high': (a, b) => lowestVariantPriceCents(b) - lowestVariantPriceCents(a),
      newest: (a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0),
    }

    return [...matches].sort(sorters[sort] ?? sorters.featured)
  }, [category, query, sort])

  return (
    <article className="page-shell">
      <header className="lux-page-header">
        <span className="lux-eyebrow">Products</span>
        <h1>Shop the drop</h1>
        <p>Premium hardware, clean silhouettes, and fast checkout.</p>
      </header>

      <section>
        <div className="lux-filter-row">
          {categories.map((value) => (
            <button
              key={value}
              type="button"
              className={`lux-filter ${category === value ? 'lux-filter--active' : ''}`}
              onClick={() => setCategory(value)}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="lux-toolbar">
          <input
            className="lux-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products…"
            aria-label="Search products"
          />
          <span className="lux-eyebrow">Sort by:</span>
          <select
            className="lux-select"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </section>

      <section className="lux-grid-4">
        {filtered.map((product) => {
          const image = Array.isArray(product.images) ? product.images[0] : null
          const variants = Array.isArray(product.variants) ? product.variants : []
          const firstVariant = variants[0] ?? null
          const priceCents = lowestVariantPriceCents(product)
          const inStock =
            variants.length === 0
              ? true
              : variants.some((variant) =>
                  typeof variant.stock === 'number' ? variant.stock > 0 : true
                )

          return (
            <article key={product.slug} className="lux-product-card">
              <Link to={`/products/${product.slug}`} className="lux-product-card__media">
                {image ? (
                  <img src={image} alt={product.name} loading="lazy" />
                ) : (
                  <div className="lux-product-card__mediaFallback" aria-hidden="true">
                    ✦
                  </div>
                )}
                <div className="lux-product-card__overlay">
                  <button
                    className="lux-button lux-button--primary"
                    disabled={!firstVariant || !inStock}
                    onClick={(event) => {
                      event.preventDefault()
                      if (!firstVariant) return
                      addItem({ slug: product.slug, sku: firstVariant.sku, quantity: 1 })
                    }}
                  >
                    Add to Bag
                  </button>
                </div>
              </Link>

              <div className="lux-product-card__body">
                <p className="lux-eyebrow">{product.category}</p>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="lux-product-card__caption">
                  {product.fulfillment ?? 'Ready to ship now.'}
                </p>
                <p className="lux-price">{formatMoney(priceCents)}</p>
              </div>
            </article>
          )
        })}
      </section>
    </article>
  )
}
