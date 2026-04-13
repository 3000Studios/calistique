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
            <span className="eyebrow">Why Calistique</span>
            <h2>A focused luxury storefront for clothing, jewelry, and editorial presentation.</h2>
            <p>Calistique pairs premium product curation with a high-end visual language built for conversion and brand recall.</p>
          </section>

          <section className="site-footer__links">
            <span className="eyebrow">Access</span>
            {publicNavItems.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
            <a href={REPOSITORY_URL} rel="noreferrer">
              GitHub repository
            </a>
          </section>

          <section className="site-footer__cta">
            <span className="eyebrow">Start shopping</span>
            <p>Browse the collection, launch the next drop, or open the studio route for site management.</p>
            <div className="hero__actions">
              <Link className="button button--primary" to="/">
                Shop now
              </Link>
              <a className="button button--ghost" href={REPOSITORY_URL} rel="noreferrer">
                Inspect repo
              </a>
            </div>
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
        </p>
      </footer>

      <GlobalTicker />
    </div>
  )
}
