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
  const prices = variants.map((v) => v.priceCents).filter((v) => typeof v === 'number')
  return prices.length ? Math.min(...prices) : 0
}

export default function ProductsPage() {
  const { addItem } = useCart()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('New')

  const categories = useMemo(() => {
    const unique = new Set(productCatalog.map((p) => p.category).filter(Boolean))
    return ['All', ...Array.from(unique)]
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = productCatalog.filter((product) => {
      const matchesQuery = !q
        ? true
        : `${product.name} ${product.category} ${product.description}`
            .toLowerCase()
            .includes(q)
      const matchesCategory = category === 'All' ? true : product.category === category
      return matchesQuery && matchesCategory
    })

    const sorted = [...base]
    if (sort === 'PriceLow') {
      sorted.sort((a, b) => lowestVariantPriceCents(a) - lowestVariantPriceCents(b))
    } else if (sort === 'PriceHigh') {
      sorted.sort((a, b) => lowestVariantPriceCents(b) - lowestVariantPriceCents(a))
    } else {
      sorted.sort((a, b) => (a.featuredRank ?? 999) - (b.featuredRank ?? 999))
    }

    return sorted
  }, [category, query, sort])

  return (
    <article className="prose-page">
      <header className="prose-header">
        <span className="eyebrow">Shop</span>
        <h1>Streetwear + statement jewelry, curated for drops.</h1>
        <p className="prose-lead">
          Focused catalog. Clean silhouettes. Hardware that reads premium.
        </p>
      </header>

      <section className="filter-row">
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tees, jewelry, add-ons…"
          aria-label="Search products"
        />
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
          <option value="New">Featured</option>
          <option value="PriceLow">Price: Low</option>
          <option value="PriceHigh">Price: High</option>
        </select>
      </section>

      <section className="product-grid">
        {filtered.map((product) => {
          const image = Array.isArray(product.images) ? product.images[0] : null
          const variants = Array.isArray(product.variants) ? product.variants : []
          const firstVariant = variants[0] ?? null
          const priceCents = lowestVariantPriceCents(product)
          const inStock =
            variants.length === 0
              ? true
              : variants.some((v) => (typeof v.stock === 'number' ? v.stock > 0 : true))

          return (
            <article key={product.slug} className="product-card">
              <Link to={`/products/${product.slug}`} className="product-card__media">
                {image ? (
                  <img src={image} alt={product.name} loading="lazy" />
                ) : (
                  <div className="media-fallback" aria-hidden="true" />
                )}
                <div className="product-card__badge">
                  {product.badges?.[0] ?? (inStock ? 'Available' : 'Sold out')}
                </div>
              </Link>

              <div className="product-card__body">
                <div className="product-card__titleRow">
                  <div>
                    <p className="muted">{product.category}</p>
                    <h2 className="product-card__title">{product.name}</h2>
                  </div>
                  <strong>{formatMoney(priceCents)}</strong>
                </div>
                <p className="muted">{product.description}</p>

                <div className="product-card__actions">
                  <Link className="button button--ghost" to={`/products/${product.slug}`}>
                    View
                  </Link>
                  <button
                    className="button button--primary"
                    disabled={!firstVariant || !inStock}
                    onClick={() => {
                      if (!firstVariant) return
                      addItem({ slug: product.slug, sku: firstVariant.sku, quantity: 1 })
                    }}
                  >
                    Quick add
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </section>
    </article>
  )
}
