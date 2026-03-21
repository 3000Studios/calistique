import React from 'react'
import { Link } from 'react-router-dom'
import PrismHeadline from '../components/PrismHeadline.jsx'
import { trackCtaClick } from '../src/siteApi.js'
import { blogIndex } from '../src/siteData.js'
import { SITE_DISPLAY_NAME } from '../src/siteMeta.js'

export default function BlogPage() {
  return (
    <div className="stack-xl">
      <section className="section-card">
        <span className="eyebrow">Insights</span>
        <PrismHeadline text="Strategy for AI-run operations" />
        <p className="section-intro">
          These articles support SEO, buyer education, and trust for the categories {SITE_DISPLAY_NAME} wants to own around execution, productized services, and AI-managed revenue systems:
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
              Read insight
            </Link>
          </article>
        ))}
      </section>

      <section className="section-card cta-band">
        <div>
          <span className="eyebrow">Turn strategy into a close path</span>
          <h2>Use the articles for context, then move into pricing or the implementation brief.</h2>
          <p className="section-intro">
            The trust layer works best when education leads directly into a real offer, a real form, or a real checkout path.
          </p>
        </div>
        <div className="hero__actions">
          <Link
            className="button button--primary"
            to="/pricing"
            onClick={() => trackCtaClick({ ctaId: 'blog-pricing', offerSlug: 'operator-os', intent: 'purchase' }).catch(() => {})}
          >
            Open pricing
          </Link>
          <Link
            className="button button--ghost"
            to="/contact"
            onClick={() => trackCtaClick({ ctaId: 'blog-contact', offerSlug: 'launch-sprint', intent: 'implementation' }).catch(() => {})}
          >
            Start implementation brief
          </Link>
        </div>
      </section>
    </div>
  )
}
