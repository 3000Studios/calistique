import React from 'react'

export default function DisclosurePage() {
  return (
    <article className="prose-page">
      <header className="prose-header">
        <h1>Affiliate Disclosure</h1>
        <p className="prose-lead">
          Some links on this site may be affiliate links or sponsored offers.
          We may receive compensation if you choose to buy or apply through
          them.
        </p>
      </header>
      <section className="prose-section">
        <p>
          Sponsored placements are labeled. Editorial recommendations are
          written separately from paid placements.
        </p>
        <p>
          We use ad inventory, affiliate links, and lead forms as monetization
          paths.
        </p>
        <p>
          For AdSense review details and approved placement snippets, see the
          AdSense review kit.
        </p>
        <p>
          Make sure the live publisher id, consent flow, and ads.txt file all
          match your verified Google account before submitting.
        </p>
        <p>
          If you enable Cloudflare Web Analytics, use the free Pages token from
          your Cloudflare dashboard rather than a third-party tracker.
        </p>
      </section>
    </article>
  )
}
