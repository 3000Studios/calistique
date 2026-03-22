import React from 'react'
import { Link } from 'react-router-dom'
import AdSenseSlot from '../components/AdSenseSlot.jsx'
import PrismHeadline from '../components/PrismHeadline.jsx'
import { trackCtaClick } from '../src/siteApi.js'
import { blogIndex } from '../src/siteData.js'
import { SITE_DISPLAY_NAME } from '../src/siteMeta.js'

export default function BlogPage() {
  const [featured, ...rest] = blogIndex.posts

  return (
    <div className="stack-2xl">
      <section className="section-card section-card--hero product-hero">
        <div className="product-hero__content stack-lg">
          <span className="eyebrow">Resources</span>
          <PrismHeadline text="Helpful camp planning resources for families and organizers" />
          <p className="section-intro">
            These articles support search, trust, and better decisions while
            reinforcing what {SITE_DISPLAY_NAME} actually helps people do:
            choose and plan stronger Georgia camp experiences.
          </p>
          <div className="tag-row">
            <span className="tag">Original planning content</span>
            <span className="tag">AdSense-ready editorial layout</span>
            <span className="tag">Conversion bridges back into programs</span>
          </div>
        </div>

        {featured ? (
          <aside className="product-hero__aside stack-md">
            <span className="panel-kicker">Featured read</span>
            <article className="product-hero__panel">
              <span className="meta-line">{featured.publishedAt}</span>
              <strong>{featured.title}</strong>
              <p className="field-note">{featured.excerpt}</p>
              <Link
                className="button button--ghost"
                to={`/blog/${featured.slug}`}
                onClick={() =>
                  trackCtaClick({
                    ctaId: `blog-featured-${featured.slug}`,
                    intent: 'learn_more',
                  }).catch(() => {})
                }
              >
                Read featured guide
              </Link>
            </article>
          </aside>
        ) : null}
      </section>

      <section className="card-grid">
        {(featured ? rest : blogIndex.posts).map((post, index) => (
          <React.Fragment key={post.slug}>
            <article className="content-card blog-card">
              <span className="meta-line">{post.publishedAt}</span>
              <h2>{post.title}</h2>
              <p className="blog-card__excerpt">{post.excerpt}</p>
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
                onClick={() =>
                  trackCtaClick({
                    ctaId: `blog-${post.slug}`,
                    intent: 'learn_more',
                  }).catch(() => {})
                }
              >
                Read article
              </Link>
            </article>
            {index === 1 ? <AdSenseSlot slot="resources-grid-inline" /> : null}
          </React.Fragment>
        ))}
      </section>
    </div>
  )
}
