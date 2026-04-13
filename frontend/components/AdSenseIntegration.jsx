import React, { useEffect, useState } from 'react'
import { ADSENSE_CLIENT_ID, ADS_ENABLED } from '../src/siteMeta.js'
import './AdSenseIntegration.css'

const AdSenseIntegration = () => {
  const [adLoaded, setAdLoaded] = useState(false)
  const [adError, setAdError] = useState(false)

  useEffect(() => {
    if (!ADS_ENABLED || !ADSENSE_CLIENT_ID) {
      return undefined
    }

    if (document.querySelector('script[data-calistique-adsense="true"]')) {
      setAdLoaded(true)
      return undefined
    }

    const script = document.createElement('script')
    script.src =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.setAttribute('data-calistique-adsense', 'true')

    script.onload = () => {
      setAdLoaded(true)
    }

    script.onerror = () => {
      setAdError(true)
    }

    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (!adLoaded || !ADSENSE_CLIENT_ID || typeof window === 'undefined') {
      return
    }

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      setAdError(true)
    }
  }, [adLoaded])

  const AdUnit = ({ slot, format = 'auto', responsive = true }) => {
    if (!ADS_ENABLED || !ADSENSE_CLIENT_ID || !adLoaded || adError) return null

    return (
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    )
  }

  return (
    <div className="adsense-integration">
      {/* Header Banner */}
      <div className="ad-container header-ad">
        <AdUnit slot="1234567890" format="auto" responsive={true} />
      </div>

      {adError && (
        <div className="ad-error">
          <p>Advertisement temporarily unavailable</p>
        </div>
      )}
    </div>
  )
}

export default AdSenseIntegration
