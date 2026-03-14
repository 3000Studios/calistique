import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import RichBlocks from '../components/RichBlocks.jsx'
import { pageLookup } from '../src/siteData.js'

const reserved = new Set(['admin', 'blog', 'products'])

export default function GenericPage() {
  const { slug } = useParams()

  if (reserved.has(slug)) {
    return <Navigate to="/" replace />
  }

  const page = pageLookup[slug]

  if (!page) {
    return <Navigate to="/not-found" replace />
  }

  return (
    <div className="stack-xl">
      <section className="section-card">
        <span className="eyebrow">Dynamic page</span>
        <h1>{page.headline ?? page.title ?? slug}</h1>
        <p className="section-intro">{page.subheadline ?? page.intro ?? 'Generated from the repo content layer.'}</p>
      </section>

      {page.sections ? <RichBlocks items={page.sections} /> : null}
      {page.items ? <RichBlocks items={page.items} /> : null}
      {page.tiers ? (
        <section className="card-grid">
          {page.tiers.map((tier) => (
            <article key={tier.name} className="content-card">
              <span className="meta-line">{tier.price}</span>
              <h2>{tier.name}</h2>
              <p>{tier.description}</p>
              <ul className="bullet-list">
                {tier.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      ) : null}
    </div>
  )
}
