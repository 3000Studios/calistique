import React from 'react'
import { ADSENSE_CLIENT_ID } from '../src/siteMeta.js'

const publisherId = ADSENSE_CLIENT_ID.replace(/^ca-/, '') || 'pub-5800977493749262'
const snippet = {
  head: `<!-- Google AdSense -->
<script async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID || 'ca-pub-5800977493749262'}"
  crossorigin="anonymous"></script>`,
  unit: `<ins class="adsbygoogle"
  style="display:block"
  data-ad-client="${ADSENSE_CLIENT_ID || 'ca-pub-5800977493749262'}"
  data-ad-slot="1234567890"
  data-ad-format="auto"
  data-full-width-responsive="true"></ins>
<script>
  (adsbygoogle = window.adsbygoogle || []).push({});
</script>`,
  adsTxt: `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`,
  webAnalytics: `<script
  defer
  src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token":"YOUR_CLOUDFLARE_WEB_ANALYTICS_TOKEN"}'></script>`,
}

export default function AdSenseReviewPage() {
  return (
    <article className="prose-page">
      <header className="prose-header">
        <h1>AdSense review kit</h1>
        <p className="prose-lead">
          The site includes clear ad labels, disclosure pages, a valid
          <code>ads.txt</code> file, and review-friendly placement surfaces.
        </p>
        <p className="prose-lead">
          Calistique is already wired with the live publisher ID, valid
          <code>ads.txt</code>, and policy routes required for review.
        </p>
      </header>

      <section className="prose-section">
        <h2>Required snippets</h2>
        <p>These are the live snippets currently used for review readiness.</p>
        <pre><code>{snippet.head}</code></pre>
        <pre><code>{snippet.unit}</code></pre>
      </section>

      <section className="prose-section">
        <h2>Ads.txt</h2>
        <pre><code>{snippet.adsTxt}</code></pre>
      </section>

      <section className="prose-section">
        <h2>Optional free analytics</h2>
        <p>
          Cloudflare Web Analytics is free on Pages, but you must add your own
          site token from the Cloudflare dashboard.
        </p>
        <pre><code>{snippet.webAnalytics}</code></pre>
      </section>

      <section className="prose-section">
        <h2>Review checklist</h2>
        <ul>
          <li>Original content on multiple pages</li>
          <li>Visible navigation and contact page</li>
          <li>Privacy, terms, and disclosure pages</li>
          <li>No deceptive labels around sponsored content</li>
          <li>Ads only on approved placements after review</li>
          <li>Keep admin pages hidden from indexing</li>
          <li>Keep checkout, contact, privacy, and disclosure routes accessible</li>
        </ul>
      </section>
    </article>
  )
}
