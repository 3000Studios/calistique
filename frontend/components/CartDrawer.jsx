import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../src/cartStore.jsx'
import { storeConfig } from '../src/siteData.js'

async function createCheckoutSession({ items, referralId }) {
  const response = await fetch('/api/checkout/session', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ items, referralId }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok || !payload?.checkoutUrl) {
    const message = payload?.message || 'Checkout failed.'
    throw new Error(message)
  }

  return payload
}

async function createPayPalCheckout({ items, referralId }) {
  const response = await fetch('/api/paypal/checkout', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ items, referralId }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok || !payload?.checkoutUrl) {
    const message = payload?.message || 'PayPal checkout failed.'
    throw new Error(message)
  }

  return payload
}

export default function CartDrawer() {
  const {
    cart,
    drawerOpen,
    closeCart,
    subtotalLabel,
    subtotalCents,
    qualifiesFreeShipping,
    freeShippingThresholdCents,
    freeShippingThresholdLabel,
    setQuantity,
    removeItem,
    clearCart,
  } = useCart()

  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [paypalLoading, setPaypalLoading] = useState(false)
  const [error, setError] = useState('')

  const referralId = useMemo(() => {
    if (typeof window === 'undefined') return ''
    const params = new URLSearchParams(window.location.search)
    return params.get('ref') || ''
  }, [])

  const shippingNote = String(storeConfig?.shippingNote ?? '').trim()

  const handleCheckout = async () => {
    setError('')
    setCheckoutLoading(true)
    try {
      const { checkoutUrl } = await createCheckoutSession({
        items: cart.map((item) => ({
          slug: item.slug,
          sku: item.sku,
          quantity: item.quantity,
        })),
        referralId,
      })
      window.location.assign(checkoutUrl)
    } catch (err) {
      setError(err?.message ?? 'Checkout failed.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handlePayPalCheckout = async () => {
    setError('')
    setPaypalLoading(true)
    try {
      const { checkoutUrl } = await createPayPalCheckout({
        items: cart.map((item) => ({
          slug: item.slug,
          sku: item.sku,
          quantity: item.quantity,
        })),
        referralId,
      })
      window.location.assign(checkoutUrl)
    } catch (err) {
      setError(err?.message ?? 'PayPal checkout failed.')
    } finally {
      setPaypalLoading(false)
    }
  }

  const freeShipRemainingCents = Math.max(
    0,
    (Number(freeShippingThresholdCents) || 0) - (Number(subtotalCents) || 0)
  )

  return (
    <AnimatePresence>
      {drawerOpen ? (
        <motion.aside
          className="cart-drawer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-label="Shopping cart"
        >
          <motion.div
            className="cart-drawer__panel"
            initial={{ x: 48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 48, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          >
            <div className="cart-drawer__header">
              <div>
                <p className="eyebrow">Cart</p>
                <h2>Your selection</h2>
              </div>
              <button className="icon-button" onClick={closeCart} aria-label="Close cart">
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="cart-drawer__empty">
                <p className="section-copy">Your cart is empty.</p>
                <button className="button button--primary" onClick={closeCart}>
                  Keep shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-drawer__items">
                  {cart.map((item) => (
                    <div key={`${item.slug}:${item.sku}`} className="cart-item">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={`${item.name} ${item.label}`}
                          loading="lazy"
                        />
                      ) : (
                        <div className="cart-item__imageFallback" aria-hidden="true" />
                      )}
                      <div className="cart-item__info">
                        <div className="cart-item__title">
                          <strong>{item.name}</strong>
                          <span className="muted">{item.label}</span>
                        </div>
                        <div className="cart-item__meta">
                          <span className="muted">
                            {item.inStock ? 'In stock' : 'Out of stock'}
                          </span>
                        </div>
                        <div className="cart-item__actions">
                          <div className="qty">
                            <button
                              className="qty__btn"
                              onClick={() =>
                                setQuantity({
                                  slug: item.slug,
                                  sku: item.sku,
                                  quantity: Math.max(0, item.quantity - 1),
                                })
                              }
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="qty__value" aria-label="Quantity">
                              {item.quantity}
                            </span>
                            <button
                              className="qty__btn"
                              onClick={() =>
                                setQuantity({
                                  slug: item.slug,
                                  sku: item.sku,
                                  quantity: Math.min(10, item.quantity + 1),
                                })
                              }
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="link-button"
                            onClick={() => removeItem({ slug: item.slug, sku: item.sku })}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-drawer__footer">
                  <div className="cart-drawer__shipping">
                    {qualifiesFreeShipping ? (
                      <p className="muted">Free shipping unlocked.</p>
                    ) : freeShippingThresholdCents ? (
                      <p className="muted">
                        Spend{' '}
                        <strong>
                          ${(freeShipRemainingCents / 100).toFixed(0)}
                        </strong>{' '}
                        more to unlock free shipping ({freeShippingThresholdLabel}).
                      </p>
                    ) : null}
                    {shippingNote ? <p className="muted">{shippingNote}</p> : null}
                  </div>

                  {error ? <p className="form-error">{error}</p> : null}

                  <div className="cart-drawer__total">
                    <span className="muted">Subtotal</span>
                    <strong>{subtotalLabel}</strong>
                  </div>

                  <button
                    className="lux-button lux-button--primary cart-drawer__checkout"
                    onClick={handleCheckout}
                    disabled={checkoutLoading || cart.some((i) => !i.inStock)}
                  >
                    {checkoutLoading ? 'Starting checkout…' : 'Checkout'}
                  </button>
                  <button
                    className="lux-button lux-button--ghost cart-drawer__checkout"
                    onClick={handlePayPalCheckout}
                    disabled={paypalLoading || cart.some((i) => !i.inStock)}
                  >
                    {paypalLoading ? 'Starting PayPal…' : 'Pay with PayPal'}
                  </button>

                  <div className="cart-drawer__upsells">
                    <p className="muted">Order bumps</p>
                    <p className="muted">
                      Add a premium gift bag or chain extender from the catalog.
                    </p>
                  </div>

                  <button className="lux-button lux-button--ghost" onClick={clearCart}>
                    Clear cart
                  </button>
                </div>
              </>
            )}
          </motion.div>

          <button className="cart-drawer__backdrop" onClick={closeCart} aria-label="Close cart backdrop" />
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
