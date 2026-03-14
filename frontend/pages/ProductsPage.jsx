import React from 'react'
import { Link } from 'react-router-dom'
import { productCatalog } from '../src/siteData.js'

export default function ProductsPage() {
  return (
    <div className="stack-xl">
      <section className="section-card">
        <span className="eyebrow">Product engine</span>
        <h1>Monetizable building blocks</h1>
        <p className="section-intro">Use AI-run product pages, pricing, and deploy workflows to turn traffic into offers.</p>
      </section>

      <section className="card-grid">
        {productCatalog.map((product) => (
          <article key={product.slug} className="content-card">
            <span className="meta-line">{product.priceAnchor}</span>
            <h2>{product.name}</h2>
            <p>{product.summary}</p>
            <p className="content-card__outcome">{product.outcome}</p>
            <Link className="button button--ghost" to={`/products/${product.slug}`}>
              Open product page
            </Link>
          </article>
        ))}
      </section>
    </div>
  )
}
