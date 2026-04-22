import React, { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE_DISPLAY_NAME } from '../src/siteMeta.js'
import { useCart } from '../src/cartStore.jsx'
import { productCatalog } from '../src/siteData.js'
import './Navigation.css'

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const location = useLocation()
  const { cart, toggleCart } = useCart()

  useEffect(() => {
    setIsMenuOpen(false)
    setSearchOpen(false)
    setQuery('')
  }, [location.pathname])

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Shop' },
    { path: '/about', label: 'About' },
    { path: '/blog', label: 'Style Notes' },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return []
    return productCatalog
      .filter((product) =>
        `${product.name} ${product.description} ${product.category} ${product.dropId ?? ''}`
          .toLowerCase()
          .includes(normalized)
      )
      .slice(0, 6)
  }, [query])

  return (
    <>
      <motion.nav className="lux-nav" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.3 }}>
        <div className="lux-nav__inner">
          <Link to="/" className="lux-nav__brand">
            <span className="lux-nav__orb" aria-hidden="true" />
            <span className="lux-nav__wordmark">
              {SITE_DISPLAY_NAME.replace('.xyz', '')}
              <small>.xyz</small>
            </span>
          </Link>

          <div className="lux-nav__links">
            {navItems.map((item, index) => (
              <motion.div key={item.path} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
                <Link
                  to={item.path}
                  className={`lux-nav__link ${isActive(item.path) ? 'lux-nav__link--active' : ''}`}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="lux-nav__actions">
            <button
              className="lux-icon-button"
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen((value) => !value)}
            >
              ⌕
            </button>
            <button className="lux-icon-button" onClick={toggleCart} aria-label="Open cart" type="button">
              <span style={{ position: 'relative', display: 'inline-block' }}>
                👜
                {cart.length > 0 ? <span className="lux-cart-badge">{cart.length}</span> : null}
              </span>
            </button>
            <Link className="lux-icon-button" to="/account" aria-label="Account">
              ◌
            </Link>
            <button
              className="lux-icon-button lux-mobile-toggle"
              type="button"
              aria-label="Toggle navigation"
              onClick={() => setIsMenuOpen((value) => !value)}
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {searchOpen ? (
          <motion.div className="lux-search" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <div className="lux-search__inner">
              <div className="lux-search__row">
                <input
                  className="lux-search__input"
                  type="text"
                  placeholder="Search products, collections..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <button className="lux-icon-button" type="button" onClick={() => setSearchOpen(false)}>
                  ✕
                </button>
              </div>

              <div className="lux-search__results">
                {query.trim() && results.length === 0 ? (
                  <div className="lux-search__result">
                    <strong>No products found</strong>
                  </div>
                ) : null}

                {results.map((product) => (
                  <Link
                    key={product.slug}
                    className="lux-search__result"
                    to={`/products/${product.slug}`}
                    onClick={() => setSearchOpen(false)}
                  >
                    <strong>{product.name}</strong>
                    <span>
                      {product.category}
                      {product.variants?.[0]?.priceCents
                        ? ` · $${Math.round(product.variants[0].priceCents / 100)}`
                        : ''}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div className="lux-mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                {item.label}
              </Link>
            ))}
            <Link to="/account">Account</Link>
            <Link to="/contact">Contact</Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default Navigation
