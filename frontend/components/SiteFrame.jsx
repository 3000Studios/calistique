import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import PrismEnvironment from './PrismEnvironment.jsx'
import { publicNavItems, publicStatusLines, publicTickerItems } from '../src/siteChrome.js'

export default function SiteFrame() {
  return (
    <div className="shell">
      <PrismEnvironment navItems={publicNavItems} statusLines={publicStatusLines} tickerItems={publicTickerItems} />
      <header className="topbar">
        <NavLink className="brand" to="/">
          <span className="brand__pulse" />
          <span className="brand__wordmark">MyAppAI</span>
        </NavLink>
        <div className="topbar__status">
          <span className="topbar__status-line">AI System Manager</span>
          <span className="topbar__status-line">From prompt to execution-ready work</span>
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <span className="eyebrow">MyAppAI</span>
            <h2>Run delivery, automation, and growth from one AI-managed operating system.</h2>
            <p>
              MyAppAI helps founders and teams turn natural language into approved tasks, generated assets,
              deployment actions, and repeatable workflows.
            </p>
          </div>
          <div className="site-footer__links">
            {publicNavItems
              .filter((item) => item.to !== '/admin/login')
              .map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
          </div>
          <div className="site-footer__cta">
            <span className="eyebrow">Best next step</span>
            <p>Start with the strategy pages, then move into pricing and implementation offers.</p>
            <div className="hero__actions">
              <Link className="button button--primary" to="/pricing">
                View pricing
              </Link>
              <Link className="button button--ghost" to="/contact">
                Book a build path
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
