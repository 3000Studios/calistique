import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { productCatalog, storeConfig } from './siteData.js'

const CART_STORAGE_KEY = 'calistique.cart.v1'

function safeParse(json) {
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

function loadCart() {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(CART_STORAGE_KEY)
  const parsed = raw ? safeParse(raw) : null
  return Array.isArray(parsed) ? parsed : []
}

function saveCart(cart) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
}

function findProduct(slug) {
  return productCatalog.find((p) => p.slug === slug) ?? null
}

function findVariant(product, sku) {
  const variants = Array.isArray(product?.variants) ? product.variants : []
  return variants.find((v) => v.sku === sku) ?? null
}

function formatMoney(cents, currency = 'USD') {
  const amount = (Number(cents ?? 0) || 0) / 100
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => loadCart())
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    saveCart(cart)
  }, [cart])

  const enrichedItems = useMemo(() => {
    return cart
      .map((item) => {
        const product = findProduct(item.slug)
        if (!product) return null
        const variant = findVariant(product, item.sku)
        if (!variant) return null
        const quantity = Math.max(1, Math.min(Number(item.quantity ?? 1) || 1, 10))
        return {
          slug: product.slug,
          sku: variant.sku,
          quantity,
          name: product.name,
          label: variant.label ?? '',
          priceCents: variant.priceCents ?? 0,
          image: Array.isArray(product.images) ? product.images[0] : null,
          inStock: typeof variant.stock === 'number' ? variant.stock > 0 : true,
        }
      })
      .filter(Boolean)
  }, [cart])

  const subtotalCents = enrichedItems.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0
  )

  const freeShippingThresholdCents = Number(storeConfig?.freeShippingThresholdCents ?? 0) || 0
  const freeShippingThresholdLabel = formatMoney(freeShippingThresholdCents, 'USD')
  const qualifiesFreeShipping =
    freeShippingThresholdCents > 0 && subtotalCents >= freeShippingThresholdCents

  const value = useMemo(() => {
    return {
      cart: enrichedItems,
      rawCart: cart,
      drawerOpen,
      subtotalCents,
      subtotalLabel: formatMoney(subtotalCents, 'USD'),
      qualifiesFreeShipping,
      freeShippingThresholdCents,
      freeShippingThresholdLabel,
      openCart: () => setDrawerOpen(true),
      closeCart: () => setDrawerOpen(false),
      toggleCart: () => setDrawerOpen((v) => !v),
      clearCart: () => setCart([]),
      addItem: ({ slug, sku, quantity = 1 }) => {
        setCart((prev) => {
          const next = [...prev]
          const existingIndex = next.findIndex((i) => i.slug === slug && i.sku === sku)
          const q = Math.max(1, Math.min(Number(quantity ?? 1) || 1, 10))
          if (existingIndex >= 0) {
            next[existingIndex] = {
              ...next[existingIndex],
              quantity: Math.min(10, (Number(next[existingIndex].quantity ?? 1) || 1) + q),
            }
          } else {
            next.push({ slug, sku, quantity: q })
          }
          return next
        })
        setDrawerOpen(true)
      },
      setQuantity: ({ slug, sku, quantity }) => {
        setCart((prev) => {
          const next = prev
            .map((item) => {
              if (item.slug !== slug || item.sku !== sku) return item
              return { ...item, quantity: Number(quantity) }
            })
            .filter((item) => (Number(item.quantity ?? 0) || 0) > 0)
          return next
        })
      },
      removeItem: ({ slug, sku }) => {
        setCart((prev) => prev.filter((i) => !(i.slug === slug && i.sku === sku)))
      },
    }
  }, [
    cart,
    drawerOpen,
    enrichedItems,
    freeShippingThresholdCents,
    freeShippingThresholdLabel,
    qualifiesFreeShipping,
    subtotalCents,
  ])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}
