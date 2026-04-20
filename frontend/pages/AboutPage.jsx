import React from 'react'
import { SUPPORT_EMAIL } from '../src/siteMeta.js'

export default function AboutPage() {
return (
  <article className="prose-page">
    <header className="prose-header">
      <h1>About Calistique</h1>
      <p className="prose-lead">
        Calistique is a luxury streetwear and statement-jewelry studio built around limited drops, clean silhouettes, and premium hardware.
      </p>
    </header>

    <section className="prose-section">
      <h2>What We Make</h2>
      <p>
        We design drop-first apparel essentials and jewelry that photographs cleanly, stacks well, and wears comfortably in daily rotation.
      </p>
      <p>
        Each collection is curated to stay premium: fewer SKUs, stronger styling, and a buying experience that is fast on mobile.
      </p>
    </section>

    <section className="prose-section">
      <h2>Who It’s For</h2>
      <ul>
        <li><b>Streetwear buyers</b> who want clean silhouettes and premium weight</li>
        <li><b>Jewelry buyers</b> who want statement hardware without the noise</li>
        <li><b>Creators</b> who need camera-ready styling that reads expensive</li>
        <li><b>Minimalists</b> who build a rotation from fewer, better pieces</li>
      </ul>
    </section>

    <section className="prose-section">
      <h2>Service Standard</h2>
      <p>
        Secure Stripe Checkout, fast shipping, and clear policies. If you have questions about sizing, materials, or returns, email us and we’ll help quickly.
      </p>
    </section>

    <section className="prose-section">
      <h2>Built by 3000Studios</h2>
      <p>
        Calistique is operated by <a href="https://github.com/3000Studios" rel="noopener noreferrer">3000Studios</a>.
      </p>
    </section>

    <section className="prose-cta">
      <p>
        Questions or feedback? Reach us at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </section>
  </article>
)
}
