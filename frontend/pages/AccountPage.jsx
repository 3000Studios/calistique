import React from 'react'
import { Link } from 'react-router-dom'

export default function AccountPage() {
  return (
    <article className="lux-account page-shell">
      <header className="lux-section-heading lux-section-heading--center">
        <span className="lux-eyebrow">Account</span>
        <h1>Your Calistique.xyz account</h1>
        <p>
          Sign in to manage orders, saved sizes, early-access alerts, and concierge
          support.
        </p>
      </header>

      <section className="lux-account-grid">
        <div className="lux-panel">
          <h2>Member access</h2>
          <p>
            Use the secure account flow to review orders and keep delivery details ready
            for faster checkout.
          </p>
          <div className="lux-button-row">
            <Link className="lux-button lux-button--primary" to="/admin/login">
              Sign in
            </Link>
            <Link className="lux-button lux-button--ghost" to="/contact">
              Contact concierge
            </Link>
          </div>
        </div>

        <div className="lux-panel">
          <h2>Benefits</h2>
          <ul className="lux-feature-list">
            <li>Track every order from payment to delivery</li>
            <li>Save preferred sizes and shipping information</li>
            <li>Get private restock and drop alerts</li>
            <li>Access premium support for returns and exchanges</li>
          </ul>
        </div>
      </section>
    </article>
  )
}
