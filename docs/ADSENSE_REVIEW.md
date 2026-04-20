# AdSense Review

This repo ships the baseline compliance wiring for AdSense review:

- `frontend/components/SiteSeo.jsx` loads the AdSense script only on ads-eligible pages when `VITE_ENABLE_ADS=true` and `VITE_ADSENSE_CLIENT_ID` is present.
- `public/ads.txt` is published at the site root for crawler review.
- `frontend/components/SiteFrame.jsx` includes disclosure-oriented footer copy.

## Replace placeholders

Before going live, replace the placeholder publisher id in `public/ads.txt` with the real AdSense publisher id.

## Snippet used by the app

```html
<script
  async
  crossorigin="anonymous"
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5800977493749262"
></script>
```

## Review checklist

- Privacy policy is published.
- Disclosure page is published.
- Ads are not placed on restricted or low-value pages.
- Domain ownership is verified in Search Console / AdSense.
- `ads.txt` is reachable at `https://your-domain/ads.txt`.
