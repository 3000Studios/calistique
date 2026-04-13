import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE_DISPLAY_NAME } from '../src/siteMeta.js'
import './Navigation.css'

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const navItems = [
    { path: '/', label: 'Home', icon: '◌' },
    { path: '/blog', label: 'Blueprints', icon: '◔' },
    { path: '/products', label: 'Products', icon: '✦' },
    { path: '/adsense-review', label: 'AdSense', icon: '✦' },
    { path: '/contact', label: 'Contact', icon: '↗' },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <motion.nav
      className={`navigation ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <motion.div className="brand-logo" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }}>
              M
            </motion.div>
            <span className="brand-text">{SITE_DISPLAY_NAME}</span>
          </Link>
        </div>

        <div className="nav-menu">
          <div className="nav-links">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
              >
                <Link to={item.path} className="nav-link">
                  <span className="nav-label">{item.label}</span>
                </Link>
                {isActive(item.path) && <motion.div className="active-indicator" layoutId="activeIndicator" />}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="nav-actions">
          <Link to="/admin/login" className="nav-admin-btn">
            Admin
          </Link>
          <motion.button
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen((value) => !value)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            aria-label="Toggle navigation"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.span key="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  ✕
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  ☰
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mobile-menu-content">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={item.path} className="mobile-nav-link">
                    <span className="mobile-nav-icon">{item.icon}</span>
                    <span className="mobile-nav-label">{item.label}</span>
                  </Link>
                </motion.div>
              ))}
              <motion.div className="mobile-nav-item" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <Link to="/admin/login" className="mobile-nav-link mobile-admin-link">
                  <span className="mobile-nav-icon">⚙</span>
                  <span className="mobile-nav-label">Admin</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navigation
