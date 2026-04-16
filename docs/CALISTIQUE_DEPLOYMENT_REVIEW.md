# Calistique Deployment + Monetization Review

This checklist is the operational baseline for deploying `calistique.com` as a premium fashion/jewelry storefront with revenue channels enabled.

## 1) Duplicate and quality review

- Repository-level duplicate business domains were reviewed: storefront, checkout, AdSense, legal pages, and analytics are present once in the active frontend path.
- Off-brand duplicate content was removed from the primary products page (food/kitchen fallback copy replaced with fashion/jewelry copy).
- Checkout logic remains centralized in `server/services/commerceService.js` (Stripe + PayPal).

## 2) Required environment variables

Use `.env.example` as the source of truth. Minimum production variables:

- Core: `SITE_URL`, `SITE_ORIGIN`, `CLOUDFLARE_PAGES_PROJECT_NAME`
- Branding: `VITE_SITE_DISPLAY_NAME`, `VITE_SITE_DOMAIN`, `VITE_SITE_TITLE`
- AdSense: `VITE_ENABLE_ADS=true`, `VITE_ADSENSE_CLIENT_ID`, `ADSENSE_PUBLISHER_ID`
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY`
- PayPal: `PAYPAL_ENV=live`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`
- CJ: `CJ_WEBSITE_ID`, `CJ_API_KEY`

Optional per-product monetization:

- `STRIPE_PRICE_<PRODUCT_SLUG_SUFFIX>`
- `STRIPE_MODE_<PRODUCT_SLUG_SUFFIX>`
- `PAYPAL_PRICE_<PRODUCT_SLUG_SUFFIX>_USD`

## 3) AdSense readiness

Before requesting review:

1. Replace placeholder AdSense publisher/client IDs.
2. Confirm `ads.txt` contains real publisher ID.
3. Keep policy pages live and linked in footer (`/privacy`, `/terms`, `/disclosure`).
4. Keep ad labels visible and avoid ad-heavy layouts above the fold.

## 4) CJ dropshipping integration readiness

Current state:

- Repo is prepared for CJ credentials and affiliate placements.
- Product cards support external affiliate links.

Next implementation step (requires live keys):

1. Ingest CJ product feed server-side.
2. Persist curated CJ catalog into `content/products/*.json`.
3. Render CJ pricing/availability badges on product and collection pages.
4. Track conversion events by partner (`cj`, `stripe`, `paypal`).

## 5) Cloudflare deployment checks

1. `npm run lint`
2. `npm run test`
3. `npm run build`
4. `npm run pages:deploy`
5. Verify production:
   - Homepage renders with Calistique branding.
   - `/products` contains fashion/jewelry copy and working outbound links.
   - Stripe/PayPal checkout buttons resolve for mapped offers.
   - Legal pages are reachable.
   - Analytics token is active.

## 6) Security notes

- Never commit live secrets.
- Use Cloudflare Pages project secrets for all payment/ad network credentials.
- Keep webhook secrets and API keys server-side only.
