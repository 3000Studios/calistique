import React, { useEffect } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import AuroraBackdrop from '../backgrounds/AuroraBackdrop.jsx'
import SiteSeo from './SiteSeo.jsx'
import Navigation from './Navigation.jsx'
import GlobalTicker from './GlobalTicker.jsx'
import { publicTickerItems, publicNavItems } from '../src/siteChrome.js'
import {
  REPOSITORY_URL,
  getCopyrightLine,
  SITE_URL,
  SITE_DOMAIN,
  SITE_DISPLAY_NAME,
} from '../src/siteMeta.js'
import { trackConversionEvent } from '../src/siteApi.js'

export default function SiteFrame() {
  const location = useLocation()

  useEffect(() => {
    trackConversionEvent('page_view', {
      path: `${location.pathname}${location.search}`,
    }).catch(() => {})
  }, [location.pathname, location.search])

  return (
    <div className="shell">
      <SiteSeo />
      <AuroraBackdrop variant="public" />

      <header className="site-header">
        <Navigation />
      </header>

      <main className="page page--public">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="site-footer__grid">
          <section className="site-footer__brand">
            <span className="eyebrow">Portfolio Standard</span>
            <h2>
              One brand, one repo, one domain, one production rule set.
            </h2>
            <p>
              {SITE_DISPLAY_NAME} is structured for revenue, SEO, product pages,
              newsletter capture, and clear disclosures without clutter.
            </p>
          </section>

          <section className="site-footer__links">
            <span className="eyebrow">Access</span>
            {publicNavItems.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/disclosure">Disclosure</Link>
            <a href={REPOSITORY_URL} rel="noreferrer">
              GitHub repository
            </a>
          </section>

          <section className="site-footer__cta">
            <span className="eyebrow">Operating Truth</span>
            <p>
              Publish new offers, update content, and keep monetization current
              without changing the standard.
            </p>
            <div className="hero__actions">
              <Link className="button button--primary" to="/blog">
                Read blueprints
              </Link>
              <a
                className="button button--ghost"
                href={REPOSITORY_URL}
                rel="noreferrer"
              >
                Inspect repo
              </a>
            </div>
            <p className="site-footer__note">
              AdSense and disclosure settings live in the repo so review and
              compliance checks are visible before deploy.
            </p>
          </section>
        </div>

        <div className="site-ticker">
          {publicTickerItems.map((item) => (
            <span key={item} className="site-ticker__item">
              {item}
            </span>
          ))}
        </div>

        <p className="site-footer__legal">
          <a href={SITE_URL} rel="noopener noreferrer">
            {SITE_DOMAIN}
          </a>
          <span aria-hidden="true"> · </span>
          <span>{getCopyrightLine()}</span>
          <span aria-hidden="true"> · </span>
          <a href={REPOSITORY_URL} rel="noopener noreferrer">
            GitHub
          </a>
          <span aria-hidden="true"> · </span>
          <a href="/blog">Blog</a>
        </p>
      </footer>

      <GlobalTicker />
    </div>
  )
}
