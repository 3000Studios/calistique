import React from 'react'
import { Link } from 'react-router-dom'
import AdSenseSlot from '../components/AdSenseSlot.jsx'
import { blogPosts } from '../src/siteData.js'

const featured = blogPosts.slice(0, 6)

export default function BlogIndexPage() {
  return (
    <article className="prose-page blog-index">
      <header className="prose-header">
        <span className="eyebrow">Cajun recipe research</span>
        <h1>Recipes, restaurant guides, and kitchen recommendations.</h1>
        <p className="prose-lead">
          Evergreen food content built to attract search traffic, improve ad
          fill, and send readers to cookware, spice, and delivery offers.
        </p>
      </header>

      <section className="blog-grid">
        {featured.map((post, index) => (
          <article key={post.slug} className="blog-card">
            <span className="meta-line">{post.publishedAt}</span>
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
