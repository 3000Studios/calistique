import React, { useEffect } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import SiteSeo from './SiteSeo.jsx'
import Navigation from './Navigation.jsx'
import CartDrawer from './CartDrawer.jsx'
import { publicNavItems } from '../src/siteChrome.js'
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

      <header className="site-header">
        <Navigation />
      </header>

      <main className="page page--public">
        <Outlet />
      </main>

      <CartDrawer />

      <footer className="site-footer">
        <div className="site-footer__grid">
          <section className="site-footer__brand">
            <span className="eyebrow">Calistique.xyz</span>
            <h2>Elegance redefined for modern luxury commerce.</h2>
            <p>
              {SITE_DISPLAY_NAME} combines premium merchandising, secure checkout,
              and the foundation required for Google review and revenue growth.
            </p>
          </section>

          <section className="site-footer__links">
            <span className="eyebrow">Navigate</span>
            {publicNavItems.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/disclosure">Disclosure</Link>
          </section>

          <section className="site-footer__cta">
            <span className="eyebrow">Inner Circle</span>
            <p>Get private drop alerts, styling updates, and concierge support.</p>
            <div className="lux-button-row">
              <Link className="lux-button lux-button--primary" to="/products">
                Shop collection
              </Link>
              <Link className="lux-button lux-button--ghost" to="/blog">
                Style notes
              </Link>
            </div>
            <p className="site-footer__note">
              Read our disclosure and privacy policy for payment, ad, and data practices.
            </p>
          </section>
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
    </div>
  )
}
