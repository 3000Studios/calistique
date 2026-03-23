# Cloudflare Bindings

This repository is configured for a **Cloudflare Pages** deployment that serves the Camp Dream GA public app from `dist/`.

## Safe local secret setup

Do not commit Cloudflare, GitHub, Stripe, PayPal, OpenAI, or R2 credentials.

Use only local, ignored files:

- `.env`
- `.env.local`
- `.dev.vars`

## Non-secret defaults in `wrangler.toml`

Tracked defaults are limited to safe runtime values:

- `APP_NAME=campdreamga`
- `SITE_URL=https://campdreamga.com`
- `WWW_SITE_URL=https://www.campdreamga.com`
- `SITE_ORIGIN=https://campdreamga.com`
- `WWW_SITE_ORIGIN=https://www.campdreamga.com`
- `API_MODE=repo-local`
- `VITE_ENABLE_ADS=false`

Secrets must stay out of `wrangler.toml`.

## Recommended Cloudflare Pages variables

Set these in **Cloudflare Pages → Settings → Environment variables**:

- `CLOUDFLARE_PAGES_PROJECT_NAME`
- `CLOUDFLARE_PAGES_BRANCH`
- `APP_NAME`
- `SITE_URL`
- `WWW_SITE_URL`
- `SITE_ORIGIN`
- `WWW_SITE_ORIGIN`
- `API_MODE`
- `ADMIN_EMAIL`
- `ADMIN_PASSCODE`
- `ADMIN_API_KEY`
- `ADMIN_SESSION_SECRET`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_EMAIL`
- `PAYPAL_ENV`
- `UNSPLASH_ACCESS_KEY`
- `PEXELS_API_KEY`
- `PIXABAY_API_KEY`
- `R2_PUBLIC_BASE_URL`
- `R2_BUCKET_NAME`
- `R2_S3_ENDPOINT`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`

For public analytics or ads, set the matching `VITE_*` keys locally before build or in Cloudflare if using git-based Pages builds.

## R2 binding

This repo already includes the bucket binding shape in `wrangler.toml`:

```toml
[[r2_buckets]]
binding = "ASSETS_BUCKET"
bucket_name = "campdreamga"
preview_bucket_name = "campdreamga-preview"
```

## Pages secret sync

If you keep secrets in a local `.dev.vars` file, upload them with:

```bash
npm run pages:secret:bulk
```

## Important

- The Cloudflare API token is separate from R2 S3 credentials.
- `wrangler pages project list` shows which Pages projects are already available in the authenticated account.
- If `campdreamga` does not exist yet, create it with `npm run pages:project:create`.
- Never commit live token values into `wrangler.toml`, `.env.example`, `.dev.vars.example`, or tracked source files.
