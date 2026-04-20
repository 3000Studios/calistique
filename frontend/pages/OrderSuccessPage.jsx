import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../src/cartStore.jsx'

async function fetchSession(sessionId) {
  const response = await fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`, {
    method: 'GET',
    headers: { accept: 'application/json' },
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload?.message || 'Unable to verify order.')
  }
  return payload
}

export default function OrderSuccessPage() {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id') || ''
  const { clearCart } = useCart()
  const [state, setState] = useState({ status: 'loading', data: null, error: '' })

  useEffect(() => {
    if (!sessionId) {
      setState({ status: 'error', data: null, error: 'Missing session.' })
      return
    }
    let active = true
    fetchSession(sessionId)
      .then((payload) => {
        if (!active) return
        setState({ status: 'ready', data: payload, error: '' })
        if (payload?.paymentStatus === 'paid' || payload?.status === 'complete') {
          clearCart()
        }
      })
      .catch((error) => {
        if (!active) return
        setState({ status: 'error', data: null, error: error?.message ?? 'Unable to verify order.' })
      })
    return () => {
      active = false
    }
  }, [clearCart, sessionId])

  return (
    <article className="prose-page">
      <header className="prose-header">
        <span className="eyebrow">Order</span>
        <h1>Payment received.</h1>
        <p className="prose-lead">Your order is confirmed. We’ll ship it fast.</p>
      </header>

      {state.status === 'loading' ? <p className="muted">Verifying checkout session…</p> : null}
      {state.status === 'error' ? <p className="form-error">{state.error}</p> : null}

      {state.status === 'ready' ? (
        <section className="shop-detail__grid">
          <div className="shop-detail__card">
            <h2>Status</h2>
            <p className="muted">
              {state.data?.paymentStatus ?? state.data?.status ?? 'unknown'}
            </p>
          </div>
          <div className="shop-detail__card">
            <h2>Total</h2>
            <p className="muted">
              {typeof state.data?.amountTotal === 'number'
                ? `$${Math.round(state.data.amountTotal / 100)}`
                : '—'}
            </p>
          </div>
          <div className="shop-detail__card">
            <h2>Receipt</h2>
            {state.data?.receiptUrl ? (
              <a className="button button--primary" href={state.data.receiptUrl} target="_blank" rel="noreferrer">
                View receipt
              </a>
            ) : (
              <p className="muted">Receipt link will appear once available.</p>
            )}
          </div>
        </section>
      ) : null}

      <div className="hero__actions">
        <Link className="button button--primary" to="/products">
          Continue shopping
        </Link>
        <Link className="button button--ghost" to="/blog">
          Style notes
        </Link>
      </div>
    </article>
  )
}
