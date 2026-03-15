import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import AuroraBackdrop from '../backgrounds/AuroraBackdrop.jsx'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Blog', to: '/blog' },
  { label: 'Products', to: '/products' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Admin', to: '/admin/login' }
]

export default function SiteFrame() {
  return (
    <div className="shell">
      <AuroraBackdrop variant="marketing" />
      <header className="topbar">
        <NavLink className="brand" to="/">
          <span className="brand__pulse" />
          <span>MyAppAI</span>
        </NavLink>
        <nav className="nav">
          {navItems.map((item) => (
            <NavLink key={item.to} className="nav__link" to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </div>
  )
}
