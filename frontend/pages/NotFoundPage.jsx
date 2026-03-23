import React from 'react'
import { Link } from 'react-router-dom'
import PrismHeadline from '../components/PrismHeadline.jsx'

export default function NotFoundPage() {
  return (
    <div className="section-card centered-card">
      <span className="eyebrow">404</span>
      <PrismHeadline text="That page is not part of this demo site map." />
      <p className="section-intro">
        Head back to the homepage, Summer Camp, FAQ, or contact page and keep
        exploring the rebuilt public experience.
      </p>
      <Link className="button button--primary" to="/">
        Return home
      </Link>
    </div>
  )
}
