import React from 'react'
import { SUPPORT_EMAIL } from '../src/siteMeta.js'

export default function AboutPage() {
  return (
    <article className="page-shell">
      <section className="lux-section-heading lux-section-heading--center">
        <span className="lux-eyebrow">About</span>
        <h1>About Calistique</h1>
      </section>
      <p>Calistique is a practical notebook about style, planning, and personal organization — the everyday systems that make life run smoother. We write about capsule wardrobes and closet organization, weekly planning rituals that survive contact with real life, gift guides, packing methods, and the small home routines (like the Sunday reset) that keep chaos at bay.</p>
      <p>The approach is simple: concrete advice, real specifics, no fluff. Every article aims to give you something you can actually do — a checklist, a method, a list — not just inspiration.</p>
      <p>Calistique is published by 3000 Studios, an independent digital media studio. The site is written and maintained by our small editorial team. We don't publish sponsored content disguised as advice.</p>
      <section className="lux-account-grid">
        <div className="lux-panel">
          <h2>Our editorial standards</h2>
          <p>Advice must be actionable — if you can't do something with it this week, it gets rewritten until you can. Recommendations must be honest. Everything gets reviewed for accuracy before it goes live; when we get something wrong, we correct it and note the change. We write for real life, not an idealized version of it.</p>
        </div>
        <div className="lux-panel">
          <h2>What you'll find here</h2>
          <ul className="lux-feature-list">
            <li>Style guides (outfit planning, capsule wardrobes, seasonal transitions, closet organization)</li>
            <li>Planning systems (weekly reviews, routines)</li>
            <li>Gift guides (thoughtful, budget-honest recommendations)</li>
            <li>Home organization (decluttering, small-space setups, maintenance routines)</li>
          </ul>
        </div>
      </section>
      <section className="lux-section-heading lux-section-heading--center" style={{ marginTop: '3rem' }}>
        <p>Questions or feedback? Reach us at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
      </section>
    </article>
  )
}
