import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
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
          <span className="topbar__status-line">Developer Command Center</span>
          <span className="topbar__status-line">Natural language to executable workflows</span>
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </div>
  )
}
