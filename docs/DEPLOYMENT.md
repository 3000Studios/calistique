# Deployment — Camp Dream GA (Cloudflare Pages)

## Build output

- **Vite** builds the public app to **`dist/`** (see `vite.config.js`).
- **Wrangler** is configured with `pages_build_output_dir = "dist"` in `wrangler.toml`.

## Create the Pages project (first time)

In the [Cloudflare dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → connect your Git repo **or** create an empty project whose name matches `wrangler.toml` / `--project-name`. If deploy fails with **project not found**, the name does not exist in that account yet.

## Commands

```bash
npm install
npm run validate:env
npm run lint
npm run test
npm run build
npx wrangler pages deploy dist --project-name campdreamga
```

Set `CLOUDFLARE_API_TOKEN` in your environment (or run `wrangler login`) before deploy. **Do not** commit tokens.

## Production environment variables

Configure in **Cloudflare Pages → Settings → Environment variables** (and matching local `.env` for dev):

- `SITE_URL`, `WWW_SITE_URL` — canonical URLs.
- **Public site (Vite `VITE_*`)**: `VITE_GA4_MEASUREMENT_ID`, `VITE_GTM_CONTAINER_ID`, `VITE_META_PIXEL_ID`, `VITE_CLARITY_PROJECT_ID`, `VITE_ENABLE_ADS`, `VITE_ADSENSE_CLIENT_ID` — only non-secret IDs belong in client-exposed vars.
- **Server / API**: see `.env.example` — session secrets, Stripe, PayPal, AI keys stay **server-only**.

## Domains

Point **campdreamga.com** and **www.campdreamga.com** to Cloudflare Pages in the Cloudflare dashboard. Prefer a single **canonical** host and redirect the other.

## Secret rotation

If any API key, token, or password was **exposed in chat, tickets, or logs**, assume compromise: **rotate** it in the provider console (OpenAI, Cloudflare, GitHub, PayPal, Stripe, etc.) and update env vars only in secure storage — never in the repository.
