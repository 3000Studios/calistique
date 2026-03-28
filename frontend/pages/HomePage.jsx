import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PrismHeadline from '../components/PrismHeadline.jsx'
import { fadeUp, staggerParent } from '../animations/variants.js'
import { trackCtaClick } from '../src/siteApi.js'

function handleCtaClick(ctaId, intent) {
  trackCtaClick({
    ctaId,
    intent,
  }).catch(() => {})
}

export default function HomePage() {
  const pillars = [
    {
      eyebrow: 'Research',
      title: 'Browse before you build',
      description:
        'Ask for current information, source-backed summaries, or competitive scans and keep the research attached to the work that follows.',
    },
    {
      eyebrow: 'Operate',
      title: 'Describe the change once',
      description:
        'Use plain language to update copy, metadata, styling, workspace files, and deployment flows from the same operator surface.',
    },
    {
      eyebrow: 'Deploy',
      title: 'Ship directly from admin',
      description:
        'Review affected files, confirm the result, and send changes live through the integrated deploy pipeline.',
    },
  ]

  const workflow = [
    {
      label: '01',
      title: 'Prompt the operator',
      description:
        'Type what you want in a few sentences and let the backend interpret it into safe repository work.',
    },
    {
      label: '02',
      title: 'Inspect the plan',
      description:
        'See summaries, changed paths, deployment intent, and any blocked actions before risky work gets through.',
    },
    {
      label: '03',
      title: 'Deploy with confidence',
      description:
        'Run builds, deploy live, and keep operational status visible inside the same admin workspace.',
    },
  ]

  const capabilities = [
    {
      label: 'Research mode',
      title: 'Current-web intake with source tracking',
      description:
        'The operator can gather recent information, keep source links attached, and distinguish researched facts from code or content changes.',
      stat: 'Sources attached',
    },
    {
      label: 'Build mode',
      title: 'Repo-aware updates without leaving the browser',
      description:
        'Homepage copy, metadata, styling, content files, and deploy preparation stay in one guided flow instead of scattered tools.',
      stat: 'Workspace bounded',
    },
    {
      label: 'Deploy mode',
      title: 'Live delivery with visible deployment feedback',
      description:
        'Every operator action can return a deployment summary, changed files, and next steps so the site stays understandable while moving fast.',
      stat: 'Cloudflare linked',
    },
  ]

  const operatingSignals = [
    'Voice-ready operator workspace',
    'Secure admin + protected logs',
    'Manual Wrangler deployment flow',
    'Mobile-responsive command surface',
  ]

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
          <span className="eyebrow">MyAppAI operator platform</span>
          <PrismHeadline text="Tell the site what to do." />
          <p className="hero__lede">
            For SaaS founders seeking to optimize processes, MyAppAI provides an
            integrated platform for research, seamless UI updates, secure
            automation, and effective live deployments. Manage your entire
            workspace effortlessly.
          </p>
          <div className="tag-row">
            {[
              'Natural-language orchestration',
              'Repo-safe editing',
              'Approved integrations only',
              'Deploy-ready',
            ].map((signal) => (
              <span key={signal} className="tag">
                {signal}
              </span>
            ))}
          </div>
          <div className="hero__trust-grid">
            {[
              { label: 'Admin surface', value: 'Operator-first' },
              { label: 'Execution scope', value: 'Repo + deploy + research' },
              { label: 'Integrations', value: 'Cloudflare · GitHub · OpenAI' },
            ].map((item) => (
              <article key={item.label} className="hero-stat-card">
                <span className="meta-line">{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
          <div className="hero__actions">
            <Link
              className="button button--primary"
              to="/admin/login"
              onClick={() =>
                handleCtaClick('home-admin-login', 'operator_access')
              }
            >
              Open admin login
            </Link>
            <Link
              className="button button--ghost"
              to="/#homepage-workflow"
              onClick={() =>
                handleCtaClick('home-platform-overview', 'learn_more')
              }
            >
              See workflow
            </Link>
          </div>
        </motion.div>

        <motion.aside
          className="hero__panel hero__panel--story"
          variants={fadeUp}
        >
          <div className="hero-visual">
            <div className="hero-visual__orb hero-visual__orb--a" />
            <div className="hero-visual__orb hero-visual__orb--b" />
            <div className="hero-visual__panel">
              <span className="panel-kicker">Operator preview</span>
              <div className="hero-visual__screen">
                <div className="hero-visual__bar" />
                <div className="hero-visual__grid">
                  <div className="hero-visual__cell" />
                  <div className="hero-visual__cell" />
                  <div className="hero-visual__cell" />
                </div>
              </div>
              <div className="hero-visual__row">
                <div className="hero-visual__metric">
                  <span className="meta-line">Result mode</span>
                  <strong>research_and_apply</strong>
                </div>
                <div className="hero-visual__metric">
                  <span className="meta-line">Safety lane</span>
                  <strong>repo bounded</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="visual-grid">
            {[
              {
                label: 'Prompt',
                title: 'Rebrand the homepage and deploy',
                value:
                  'The operator interprets the request, edits approved files, and returns a deployment record.',
              },
              {
                label: 'Research',
                title: 'Find the latest references',
                value:
                  'Web research results attach sources so the operator can separate facts from applied code changes.',
              },
            ].map((item) => (
              <article key={item.title} className="visual-card">
                <span className="meta-line">{item.label}</span>
                <h3>{item.title}</h3>
                <p className="visual-card__body">{item.value}</p>
              </article>
            ))}
          </div>
        </motion.aside>
      </motion.section>

      <section className="section-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Platform scope</span>
            <h2>
              Built for operator-led website management, not a pile of
              disconnected tools.
            </h2>
            <p className="section-intro">
              The public surface stays intentionally minimal so the operational
              power lives behind admin auth where browsing, editing, planning,
              and deployment can happen in one place.
            </p>
          </div>
        </div>
        <div className="card-grid card-grid--compact">
          {pillars.map((item) => (
            <article key={item.title} className="content-card">
              <span className="meta-line">{item.eyebrow}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="homepage-workflow" className="section-card section-anchor">
        <span className="eyebrow">Workflow</span>
        <h2>From idea to live deploy in three moves.</h2>
        <div className="card-grid card-grid--compact">
          {workflow.map((entry) => (
            <article key={entry.title} className="content-card">
              <span className="meta-line">{entry.label}</span>
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card section-card--split">
        <div className="section-card__lede">
          <span className="eyebrow">Control model</span>
          <h2>Operate the site like a command center, not a pile of tabs.</h2>
          <p className="section-intro">
            The public homepage stays focused while the authenticated operator
            page handles research, planning, changes, audits, logs, and deploy
            control in one visual system.
          </p>
          <div className="signal-list">
            {operatingSignals.map((signal) => (
              <div key={signal} className="signal-pill">
                {signal}
              </div>
            ))}
          </div>
        </div>

        <div className="operator-storyboard">
          <div className="operator-storyboard__surface">
            <div className="operator-storyboard__header">
              <span className="panel-kicker">Live operator lane</span>
              <span className="meta-line">browser → plan → apply → deploy</span>
            </div>
            <div className="operator-storyboard__prompt">
              “Refresh the homepage for AI founders, keep the design premium,
              update metadata, and prepare deployment.”
            </div>
            <div className="operator-storyboard__steps">
              <div className="operator-storyboard__step">
                <span>Intent</span>
                <strong>homepage_update</strong>
              </div>
              <div className="operator-storyboard__step">
                <span>Paths</span>
                <strong>frontend + content</strong>
              </div>
              <div className="operator-storyboard__step">
                <span>Status</span>
                <strong>deploy ready</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <span className="eyebrow">Capabilities</span>
        <h2>Everything the operator page is designed to keep in one loop.</h2>
        <div className="capability-grid">
          {capabilities.map((item) => (
            <article key={item.title} className="capability-card">
              <span className="meta-line">{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="capability-card__footer">
                <span className="mini-chip">{item.stat}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card cta-band">
        <div>
          <span className="eyebrow">Start now</span>
          <h2>Log in and work on the website from the website.</h2>
          <p className="section-intro">
            MyAppAI is designed so the authenticated operator workspace becomes
            the place where you research, request, review, and ship changes.
          </p>
        </div>
        <div className="hero__actions">
          <Link
            className="button button--primary"
            to="/admin/login"
            onClick={() =>
              handleCtaClick('home-final-login', 'operator_access')
            }
          >
            Go to admin login
          </Link>
          <Link
            className="button button--ghost"
            to="/"
            onClick={() => handleCtaClick('home-final-overview', 'learn_more')}
          >
            Stay on homepage
          </Link>
        </div>
      </section>
    </div>
  )
}
