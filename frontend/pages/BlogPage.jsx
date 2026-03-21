import React from 'react'
import { Link } from 'react-router-dom'
import PrismHeadline from '../components/PrismHeadline.jsx'
import { trackCtaClick } from '../src/siteApi.js'
import { blogIndex } from '../src/siteData.js'
import { SITE_DISPLAY_NAME } from '../src/siteMeta.js'

export default function BlogPage() {
  return (
    <div className="stack-2xl">
      <section className="section-card section-card--hero">
        <span className="eyebrow">Journal</span>
        <PrismHeadline text="Execution notes from the operator stack" />
        <p className="section-intro">
          These posts support buyer education and search while reinforcing what {SITE_DISPLAY_NAME} actually helps teams do: ship with more structure and less junk.
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
            <Link
              className="button button--ghost"
              to={`/blog/${post.slug}`}
              onClick={() => trackCtaClick({ ctaId: `blog-${post.slug}`, intent: 'learn_more' }).catch(() => {})}
            >
              Read article
            </Link>
          </article>
        ))}
      </section>
    </div>
  )
}
