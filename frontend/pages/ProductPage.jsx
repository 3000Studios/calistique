import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import PrismHeadline from '../components/PrismHeadline.jsx'
import { productLookup } from '../src/siteData.js'

export default function ProductPage() {
  const { slug } = useParams()
  const product = productLookup[slug]

  if (!product) {
    return <Navigate to="/products" replace />
  }

  return (
    <div className="stack-xl">
      <section className="section-card">
        <span className="eyebrow">Revenue stream</span>
        <PrismHeadline text={product.name} />
        <p className="section-intro">{product.description ?? product.summary}</p>
      </section>

      {product.bullets ? (
        <section className="section-card">
          <h2>What it unlocks</h2>
          <ul className="bullet-list">
            {product.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
