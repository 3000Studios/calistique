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
  const [sort, setSort] = useState('featured')

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
    if (sort === 'price-low') {
      sorted.sort((a, b) => lowestVariantPriceCents(a) - lowestVariantPriceCents(b))
    } else if (sort === 'price-high') {
      sorted.sort((a, b) => lowestVariantPriceCents(b) - lowestVariantPriceCents(a))
    } else if (sort === 'newest') {
      sorted.sort((a, b) => String(b.slug).localeCompare(String(a.slug)))
    } else {
      sorted.sort((a, b) => (a.featuredRank ?? 999) - (b.featuredRank ?? 999))
    }

    return sorted
  }, [category, query, sort])

  return (
    <article className="page-shell">
      <header className="lux-section-heading lux-section-heading--split">
        <div>
          <span className="lux-eyebrow">Shop</span>
          <h1>Streetwear + statement jewelry, curated for luxury conversion.</h1>
        </div>
        <p>
          Focused catalog, premium presentation, and direct checkout paths for buyers
          ready to pay now.
        </p>
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
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tees, jewelry, add-ons…"
          aria-label="Search products"
        />
          <span className="lux-eyebrow">Sort by:</span>
          <select className="lux-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
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
              : variants.some((v) => (typeof v.stock === 'number' ? v.stock > 0 : true))

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
                <p className="lux-price">{formatMoney(priceCents)}</p>
              </div>
            </article>
          )
        })}
      </section>
    </article>
  )
}
