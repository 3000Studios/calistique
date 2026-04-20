import React from 'react'
import { Link } from 'react-router-dom'
import AdSenseSlot from '../components/AdSenseSlot.jsx'
import { blogPosts } from '../src/siteData.js'

export default function BlogIndexPage() {
  return (
    <article className="prose-page blog-index">
      <header className="prose-header">
        <span className="eyebrow">Style Notes</span>
        <h1>Streetwear, jewelry, and drop strategy.</h1>
        <p className="prose-lead">
          Editorial built to rank, convert, and reinforce the brand. Every post
          is structured for clarity, trust, and checkout intent.
        </p>
      </header>

      <section className="blog-grid">
        {blogPosts.map((post, index) => (
          <article key={post.slug} className="blog-card">
            <span className="meta-line">
              #{String(index + 1).padStart(2, '0')} · {post.publishedAt}
            </span>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <Link className="button button--ghost" to={`/blog/${post.slug}`}>
              Read more
            </Link>
            {index === 1 ? <AdSenseSlot slot="blog-index-1" /> : null}
          </article>
        ))}
      </section>

      <section className="blog-disclosure">
        <p>
          Affiliate disclosure: some outbound links may earn commissions.
          Sponsored placements are labeled and kept separate from editorial
          recommendations.
        </p>
      </section>
    </article>
  )
}
