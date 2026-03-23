import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import MetricStrip from '../components/MetricStrip.jsx'
import PrismHeadline from '../components/PrismHeadline.jsx'
import RichBlocks from '../components/RichBlocks.jsx'
import { fadeUp, staggerParent } from '../animations/variants.js'
import { trackCtaClick } from '../src/siteApi.js'
import { blogIndex, homepage } from '../src/siteData.js'

function handleCtaClick(ctaId, intent) {
  trackCtaClick({
    ctaId,
    intent,
  }).catch(() => {})
}

export default function HomePage() {
  const featuredStories = blogIndex.posts.slice(0, 3)

  return (
    <div className="stack-2xl">
      <motion.section
        className="hero hero--executive"
        variants={staggerParent}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="hero__copy hero__copy--immersive"
          variants={fadeUp}
        >
          <span className="eyebrow">{homepage.eyebrow}</span>
          <PrismHeadline text={homepage.headline} />
          <p className="hero__lede">{homepage.subheadline}</p>
          <div className="tag-row">
            {homepage.heroSignals.map((signal) => (
              <span key={signal} className="tag">
                {signal}
              </span>
            ))}
          </div>
          <div className="hero__trust-grid">
            {homepage.heroStats.map((item) => (
              <article key={item.label} className="hero-stat-card">
                <span className="meta-line">{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
          <div className="hero__actions">
            <Link
              className="button button--primary"
              to={homepage.primaryCta.to}
              onClick={() => handleCtaClick('home-summer-camp', 'learn_more')}
            >
              {homepage.primaryCta.label}
            </Link>
            <Link
              className="button button--ghost"
              to={homepage.secondaryCta.to}
              onClick={() => handleCtaClick('home-volunteer', 'learn_more')}
            >
              {homepage.secondaryCta.label}
            </Link>
          </div>
        </motion.div>

        <motion.aside
          className="hero__panel hero__panel--story"
          variants={fadeUp}
        >
          <div className="hero__media-frame hero__media-frame--story">
            <div className="hero__video-overlay" />
            <div className="hero-visual__panel">
              <span className="panel-kicker">Camp snapshot</span>
              <h2>{homepage.heroPanel.heading}</h2>
              <p>{homepage.heroPanel.body}</p>
              <div className="visual-grid">
                {homepage.heroPanel.points.map((item) => (
                  <article key={item.title} className="visual-card">
                    <span className="meta-line">{item.label}</span>
                    <h3>{item.title}</h3>
                    <p className="visual-card__body">{item.value}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div className="command-strip">
            {homepage.quickSignals.map((example) => (
              <span key={example} className="command-chip">
                {example}
              </span>
            ))}
          </div>
        </motion.aside>
      </motion.section>

      <MetricStrip items={homepage.heroStats} />

      <section className="section-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Why Camp Dream GA</span>
            <h2>
              A camp experience built around access, relationship, and real joy.
            </h2>
            <p className="section-intro">
              Summer Camp, Camp Out, volunteers, and donors all support the same
              mission: making sure children and young adults with disabilities
              can experience recreation, friendship, and fun in a place designed
              for them.
            </p>
          </div>
        </div>
        <div className="card-grid card-grid--compact">
          {homepage.impactCards.map((item) => (
            <article key={item.title} className="content-card">
              <span className="meta-line">{item.eyebrow}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p className="content-card__outcome">{item.outcome}</p>
            </article>
          ))}
        </div>
      </section>

      <RichBlocks
        title={homepage.programsHeadline}
        intro={homepage.programsIntro}
        items={homepage.programCards}
      />

      <RichBlocks
        title={homepage.communityHeadline}
        intro={homepage.communityIntro}
        items={homepage.communityCards}
      />

      <RichBlocks
        title={homepage.activityHeadline}
        intro={homepage.activityIntro}
        items={homepage.activityHighlights}
      />

      <section className="section-card">
        <span className="eyebrow">{homepage.scheduleEyebrow}</span>
        <h2>{homepage.scheduleHeadline}</h2>
        <div className="card-grid card-grid--compact">
          {homepage.scheduleCards.map((entry) => (
            <article key={entry.title} className="content-card">
              <span className="meta-line">{entry.eyebrow}</span>
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
              <p className="content-card__outcome">{entry.outcome}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Stories and updates</span>
            <h2>Stay connected with camp news, planning help, and updates.</h2>
            <p className="section-intro">
              The stories section helps families, volunteers, and supporters
              understand what camp life feels like while staying connected to
              current opportunities.
            </p>
          </div>
          <Link className="button button--ghost" to="/blog">
            Read stories
          </Link>
        </div>
        <div className="card-grid">
          {featuredStories.map((post) => (
            <article key={post.slug} className="content-card blog-card">
              <span className="meta-line">{post.publishedAt}</span>
              <h3>{post.title}</h3>
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
                  handleCtaClick(`home-story-${post.slug}`, 'learn_more')
                }
              >
                Read update
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card cta-band">
        <div>
          <span className="eyebrow">{homepage.finalCta.eyebrow}</span>
          <h2>{homepage.finalCta.heading}</h2>
          <p className="section-intro">{homepage.finalCta.body}</p>
        </div>
        <div className="hero__actions">
          <Link
            className="button button--primary"
            to={homepage.finalCta.primaryHref}
            onClick={() => handleCtaClick('home-final-donate', 'learn_more')}
          >
            {homepage.finalCta.primaryLabel}
          </Link>
          <Link
            className="button button--ghost"
            to={homepage.finalCta.secondaryHref}
            onClick={() => handleCtaClick('home-final-volunteer', 'learn_more')}
          >
            {homepage.finalCta.secondaryLabel}
          </Link>
        </div>
      </section>
    </div>
  )
}
