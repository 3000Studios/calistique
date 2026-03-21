import React from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import PrismEnvironment from './PrismEnvironment.jsx'
import SiteSeo from './SiteSeo.jsx'
import { publicNavItems, publicStatusLines, publicTickerItems } from '../src/siteChrome.js'
import { REPOSITORY_URL, SITE_DISPLAY_NAME, SITE_URL, getCopyrightLine } from '../src/siteMeta.js'
import { trackConversionEvent } from '../src/siteApi.js'

export default function SiteFrame() {
  const location = useLocation()

  React.useEffect(() => {
    trackConversionEvent('page_view', {
      path: `${location.pathname}${location.search}`
    }).catch(() => {})
  }, [location.pathname, location.search])

  return (
    <div className="shell">
      <SiteSeo />
      <PrismEnvironment navItems={publicNavItems} statusLines={publicStatusLines} tickerItems={publicTickerItems} />
      <header className="topbar">
        <NavLink className="brand" to="/">
          <span className="brand__pulse" />
          <span className="brand__wordmark">{SITE_DISPLAY_NAME}</span>
        </NavLink>
        <div className="topbar__status">
          <span className="topbar__status-line">AI system manager</span>
          <span className="topbar__status-line">From brief to revenue-ready execution</span>
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <span className="eyebrow">{SITE_DISPLAY_NAME}</span>
            <h2>Turn briefs into publishable pages, qualified leads, and revenue-ready execution.</h2>
            <p>
              {SITE_DISPLAY_NAME} acts as the AI system manager behind your public funnel, combining structured
              content, live offers, lead routing, and operator control in one delivery system.
            </p>
          </div>
          <div className="site-footer__links">
            {publicNavItems
              .filter((item) => item.to !== '/admin')
              .map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
          </div>
          <div className="site-footer__cta">
            <span className="eyebrow">Best next step</span>
            <p>Move from strategy into checkout if you are self-serve, or submit an implementation brief if you need a guided rollout.</p>
            <div className="hero__actions">
              <Link className="button button--primary" to="/pricing">
                View pricing
              </Link>
              <Link className="button button--ghost" to="/contact">
                Start implementation brief
              </Link>
            </div>
          </div>
        </div>
        <p className="site-footer__legal">
          <a href={SITE_URL} rel="noopener noreferrer">
            {SITE_URL.replace(/^https:\/\//, '')}
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
