import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="section-card centered-card">
      <span className="eyebrow">404</span>
      <h1>That page is outside the current content graph.</h1>
      <p className="section-intro">Use the admin dashboard to generate a new page or head back to the public site.</p>
      <Link className="button button--primary" to="/">
        Return home
      </Link>
    </div>
  )
}
