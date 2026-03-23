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
              A traditional Georgia camp experience for children and young
              adults with disabilities, powered by volunteers, families, donors,
              and year-round community support.
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
              <Link className="button button--ghost" to="/volunteer">
                Volunteer
              </Link>
              <Link className="button button--primary" to="/donate">
                Donate
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
              Summer Camp joy, year-round community, and a mission built around
              access, dignity, and fun.
            </h2>
            <p>
              Camp Dream GA exists to help children and young adults with
              disabilities experience recreation, friendship, and confidence in
              a space built for them.
            </p>
          </section>

          <section className="site-footer__links">
            <span className="eyebrow">Explore</span>
            {publicNavItems
              .filter((item) => item.to !== '/admin')
              .map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            <Link to="/about">Who We Are</Link>
            <Link to="/history">History</Link>
            <Link to="/team">Team</Link>
            <Link to="/location">Location</Link>
            <Link to="/blog">Stories</Link>
            {footerLegalItems.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
          </section>

          <section className="site-footer__cta">
            <span className="eyebrow">Get involved</span>
            <p>
              Families can learn about Summer Camp and Camp Out, volunteers can
              step into service, and donors can help keep camp accessible to
              more campers each year.
            </p>
            <div className="hero__actions">
              <Link className="button button--primary" to="/summer-camp">
                Explore Summer Camp
              </Link>
              <Link className="button button--ghost" to="/donate">
                Support the mission
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
