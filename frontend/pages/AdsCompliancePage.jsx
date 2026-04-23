import React from 'react'
import { ADSENSE_CLIENT_ID } from '../src/siteMeta.js'

const publisherId = ADSENSE_CLIENT_ID.replace(/^ca-/, '') || 'pub-5800977493749262'
const adsenseSnippet = `<!-- Google AdSense -->
<script async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID || 'ca-pub-5800977493749262'}"
  crossorigin="anonymous"></script>`

const adsTxtSnippet = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`

const complianceChecklist = [
  'Use the live Calistique publisher ID in ads.txt and the AdSense script.',
  'Keep ads labeled and separate from editorial content.',
  'Do not place ads on protected admin pages.',
  'Add privacy policy, terms, and disclosure pages before review.',
  'Keep CSP allowlists limited to Google AdSense and Cloudflare assets.',
  'Keep only original catalog, editorial, and policy content live during review.',
]

export default function AdsCompliancePage() {
  return (
    <article className="shop-detail">
      <section className="shop-detail__hero">
        <div className="shop-detail__copy">
          <p className="eyebrow">Ad compliance</p>
          <h1>Google AdSense review notes</h1>
          <p className="section-copy">
            Use the snippets below to prepare the site for AdSense review and
            keep the layout compliant with clear ad labeling and policy pages.
          </p>
        </div>
      </section>

      <section className="shop-detail__grid">
        <div className="shop-detail__card">
          <h2>AdSense script</h2>
          <pre>{adsenseSnippet}</pre>
        </div>
        <div className="shop-detail__card">
          <h2>ads.txt</h2>
          <pre>{adsTxtSnippet}</pre>
        </div>
        <div className="shop-detail__card">
          <h2>Checklist</h2>
          <ul>
            {complianceChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  )
}
