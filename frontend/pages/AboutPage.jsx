import React from 'react'
import { SUPPORT_EMAIL } from '../src/siteMeta.js'

export default function AboutPage() {
return (
  <article className="page-shell">
    <section className="lux-section-heading lux-section-heading--center">
      <span className="lux-eyebrow">The Maison</span>
      <h1>We don’t follow trends. We craft legacies.</h1>
      <p>
        Each piece is positioned to feel premium, convert cleanly, and support long-term
        brand growth.
      </p>
    </section>

    <section className="lux-account-grid">
      <div className="lux-panel">
        <h2>Our Heritage</h2>
        <p>
          Since 2024, Calistique has focused on uncompromising luxury, sharp
          merchandising, and elevated essentials that read premium across every device.
        </p>
        <p>
          Luxury is not excess. It is confidence, restraint, and materials that feel
          intentional.
        </p>
      </div>

      <div className="lux-panel">
        <h2>Our Promise</h2>
        <ul className="lux-feature-list">
          <li>Ethically sourced materials from trusted suppliers worldwide</li>
          <li>Master artisans and supplier-vetted fulfillment partners</li>
          <li>Secure checkout and clear returns policy</li>
          <li>Private styling support for high-intent buyers</li>
          <li>Bespoke customization and curated drop strategy</li>
        </ul>
      </div>
    </section>

    <section className="lux-section-heading lux-section-heading--center" style={{ marginTop: '3rem' }}>
      <p>
        Questions or feedback? Reach us at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </section>
  </article>
)
}
