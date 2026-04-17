# EMPIRE CORE — Env + Secrets Rewrite (Universal)

This rewrite removes project-specific variable naming and replaces it with a universal 3000Studios schema.

## Canonical domain

- Primary network domain: **`3000studios.vip`**
- Canonical hub URL: **`https://3000studios.vip`**

## Variable placement

### 1) Non-secret runtime config (`.env`)
Use `.env.example` as source template.

Contains:
- org/network identity
- shared ad IDs
- public routing URLs
- non-sensitive runtime toggles

### 2) Sensitive values (`.dev.vars` / Cloudflare Secrets)
Use `.dev.vars.example` as source template.

Contains:
- API keys
- webhook secrets
- auth/session secrets
- infrastructure credentials

Never place secrets in `wrangler.toml`.

## Wrangler variables policy

Each app `wrangler.toml` now uses universal keys:
- `ORG_NAME`
- `NETWORK_PRIMARY_DOMAIN`
- `APP_SLUG`
- `APP_DISPLAY_NAME`
- `APP_BASE_URL`
- `ADSENSE_PUBLISHER_ID`

This keeps naming consistent while allowing each app’s identity and URL.

## Domain mapping defaults

- Citadel: `https://3000studios.vip`
- Referrals: `https://referrals.3000studios.vip`
- USA: `https://usa.3000studios.vip`
- Media: `https://media.3000studios.vip`

If you keep legacy custom domains (`referrals.live`, `theunitedstates.site`, etc.), point them as aliases at the same projects.

## Quick checks

```bash
cd empire
npm run build:apps
rg "APP_NAME|SITE_URL" apps/*/wrangler.toml  # should return nothing
rg "ORG_NAME|NETWORK_PRIMARY_DOMAIN|APP_BASE_URL" apps/*/wrangler.toml
```
