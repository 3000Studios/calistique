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
          <span className="eyebrow">Stories and updates</span>
          <PrismHeadline text="Camp stories, planning help, and community updates" />
          <p className="section-intro">
            These articles help families, volunteers, and supporters stay close
            to the work of {SITE_DISPLAY_NAME} while answering common camp
            questions and sharing timely updates.
          </p>
          <div className="tag-row">
            <span className="tag">Camp stories</span>
            <span className="tag">Planning help</span>
            <span className="tag">Supporter updates</span>
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
