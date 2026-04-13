import React from 'react'

const snippet = {
  head: `<!-- Google AdSense -->
<script async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
  crossorigin="anonymous"></script>`,
  unit: `<ins class="adsbygoogle"
  style="display:block"
  data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
  data-ad-slot="1234567890"
  data-ad-format="auto"
  data-full-width-responsive="true"></ins>
<script>
  (adsbygoogle = window.adsbygoogle || []).push({});
</script>`,
  adsTxt: `google.com, pub-YOUR_PUBLISHER_ID, DIRECT, f08c47fec0942fa0`,
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
          Replace <code>YOUR_PUBLISHER_ID</code> with the publisher id from
          your approved AdSense account before review.
        </p>
      </header>

      <section className="prose-section">
        <h2>Required snippets</h2>
        <p>Use your live publisher id before requesting review.</p>
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
          <li>Use the live publisher id from your approved AdSense account</li>
        </ul>
      </section>
    </article>
  )
}
