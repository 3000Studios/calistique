import React from 'react'

export default function TestSiteBanner() {
  return (
    <div
      className="test-site-banner"
      role="note"
      aria-label="Demo site disclaimer"
    >
      <div className="test-site-banner__inner">
        <strong>TEST SITE DISCLAIMER:</strong>
        <span>
          This is NOT the real <code>campdreamga.org</code>. This site is a demo
          for testing purposes only, and nothing here is an official
          representation of the real Camp Dream GA website or organization.
        </span>
      </div>
    </div>
  )
}
