import React from 'react'
import { Link } from 'react-router-dom'
import PrismHeadline from '../components/PrismHeadline.jsx'
import { blogIndex } from '../src/siteData.js'

export default function BlogPage() {
  return (
    <div className="stack-xl">
      <section className="section-card">
        <span className="eyebrow">Insights</span>
        <PrismHeadline text="Strategy for AI-run operations" />
        <p className="section-intro">
          These articles support SEO, buyer education, and trust for the categories MyAppAI wants to own:
          execution, automation, and AI-managed delivery.
        </p>
      </section>

      <section className="card-grid">
        {blogIndex.posts.map((post) => (
          <article key={post.slug} className="content-card">
            <span className="meta-line">{post.publishedAt}</span>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <div className="tag-row">
              {post.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <Link className="button button--ghost" to={`/blog/${post.slug}`}>
              Read insight
            </Link>
          </article>
        ))}
      </section>
    </div>
  )
}
