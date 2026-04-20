import React from 'react'
import { Link } from 'react-router-dom'

export default function OrderCancelPage() {
  return (
    <article className="prose-page">
      <header className="prose-header">
        <span className="eyebrow">Checkout</span>
        <h1>Checkout canceled.</h1>
        <p className="prose-lead">No worries — your cart is still here.</p>
      </header>

      <div className="hero__actions">
        <Link className="button button--primary" to="/products">
          Back to shop
        </Link>
        <Link className="button button--ghost" to="/">
          Home
        </Link>
      </div>
    </article>
  )
}

