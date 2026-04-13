import React from 'react'

export default function PrivacyPage() {
  return (
    <article className="prose-page">
      <header className="prose-header">
        <h1>Privacy Policy</h1>
        <p className="prose-lead">
          We collect basic analytics, ad signals, and form submissions to run
          the site, measure performance, and improve monetization.
        </p>
      </header>
      <section className="prose-section">
        <p>Cookies may be used by analytics and advertising providers.</p>
        <p>Contact submissions are stored only to respond to the request.</p>
        <p>
          If you are in the EEA, UK, or Switzerland, you may see consent
          messaging before personalized ads load.
        </p>
        <p>
          You can request removal of non-essential contact data by emailing
          support.
        </p>
      </section>
    </article>
  )
}
