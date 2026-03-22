import React, { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import AuroraBackdrop from '../backgrounds/AuroraBackdrop.jsx'
import SiteSeo from './SiteSeo.jsx'
import {
  footerLegalItems,
  publicNavItems,
  publicStatusLines,
  publicTickerItems,
} from '../src/siteChrome.js'
import {
  REPOSITORY_URL,
  SITE_DISPLAY_NAME,
  SITE_DOMAIN,
  SITE_URL,
  getCopyrightLine,
} from '../src/siteMeta.js'
import { trackConversionEvent } from '../src/siteApi.js'

export default function SiteFrame() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    trackConversionEvent('page_view', {
      path: `${location.pathname}${location.search}`,
    }).catch(() => {})
    setMobileMenuOpen(false)
  }, [location.pathname, location.search])

  return (
    <div className="shell">
      <SiteSeo />
      <AuroraBackdrop variant="public" />

      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-header__brand">
            <NavLink className="brand" to="/">
              <span className="brand__pulse" />
              <span className="brand__wordmark">{SITE_DISPLAY_NAME}</span>
            </NavLink>
            <p className="site-header__tagline">
              Premium Georgia camp experiences, planning support, and
              family-focused resources.
            </p>
          </div>

          <button
            className={`site-nav__toggle${mobileMenuOpen ? ' site-nav__toggle--active' : ''}`}
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-expanded={mobileMenuOpen}
            aria-controls="site-navigation"
          >
            <span />
            <span />
          </button>

          <div
            className={`site-header__nav-wrap${mobileMenuOpen ? ' site-header__nav-wrap--open' : ''}`}
          >
            <nav className="site-nav" id="site-navigation" aria-label="Primary">
              {publicNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `site-nav__link${isActive ? ' site-nav__link--active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="site-header__actions">
              <Link className="button button--ghost" to="/contact">
                Start planning
              </Link>
              <Link className="button button--primary" to="/pricing">
                View pricing
              </Link>
            </div>
          </div>
        </div>

        <div className="site-statusbar">
          {publicStatusLines.map((line) => (
            <span key={line} className="site-statusbar__pill">
              {line}
            </span>
          ))}
        </div>
      </header>

      <main className="page page--public">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="site-footer__grid">
          <section className="site-footer__brand">
            <span className="eyebrow">Why Camp Dream GA</span>
            <h2>
              Premium Georgia camp discovery, clear planning resources, and
              confident next steps for families and groups.
            </h2>
            <p>
              Browse programs, explore planning resources, and move into the
              right booking path through a cleaner, more trustworthy site.
            </p>
          </section>

          <section className="site-footer__links">
            <span className="eyebrow">Navigate</span>
            {publicNavItems
              .filter((item) => item.to !== '/admin')
              .map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            {footerLegalItems.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
          </section>

          <section className="site-footer__cta">
            <span className="eyebrow">Deploy-ready next steps</span>
            <p>
              Use pricing for direct booking, contact for guided planning, and
              resources when you want to learn before choosing.
            </p>
            <div className="hero__actions">
              <Link className="button button--primary" to="/pricing">
                Explore pricing
              </Link>
              <Link className="button button--ghost" to="/contact">
                Contact the team
              </Link>
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
          <span aria-hidden="true"> · </span>
          <a href={REPOSITORY_URL} rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}
