# Architecture, revenue, and AdSense readiness (Camp Dream GA)

This document consolidates the product and technical plan for **campdreamga.com**: stack reality, monetization layers, Google AdSense policy alignment, analytics, AI operator pattern, security, and deployment. It is implementation-oriented and contains **no secrets**—use `.env.example` and your host dashboards for values.

If you want one copy-paste-ready repo brief for a coding agent, use [MASTER_1_ULTRA_PROMPT.md](./MASTER_1_ULTRA_PROMPT.md).

## Stack (current repo)

- **Public UI:** Vite + React + React Router (`frontend/`), styles in `frontend/styles/app.css`
- **Content:** JSON under `content/pages`, `content/blog`, `content/products`
- **API:** Express in `server/` (local dev; production may be static + Workers/Pages patterns)
- **Static output:** `dist/` (Vite `build`); Cloudflare Pages deploy target
- **Tooling:** ESLint, Prettier, Husky, Vitest, Wrangler

Do not assume Next.js unless you migrate; this repo is **Vite-first**.

## Information architecture (public)

Recommended primary navigation:

| Area      | Purpose                                         |
| --------- | ----------------------------------------------- |
| Home      | Brand, proof, primary CTAs                      |
| Solutions | Programs / services framing                     |
| Pricing   | Plans, comparison, booking/sales paths          |
| Blog      | Evergreen guides (SEO + optional ads)           |
| About     | Trust, team, story                              |
| Contact   | Leads, booking inquiries                        |
| Legal     | Privacy, Terms, Cookies, Advertising disclosure |

**Admin** routes must not appear in public nav, sitemap as indexable pages, or structured data for consumer discovery.

## Monetization (priority order)

1. **Direct revenue:** Stripe / PayPal flows, offers, checkout success/cancel—server-side session creation only; secrets in env.
2. **Leads:** Contact forms, high-ticket CTAs, newsletter or inquiry capture.
3. **AdSense (secondary):** Only on **long-form, editorial** templates (e.g. blog posts), after substantial content—not on checkout, admin, login, or thin pages.

## Google AdSense readiness (policy-aligned)

- **Content:** Original, useful, non-thin pages; no mass-scraped or purely automated filler without human review.
- **Trust:** Clear About, Contact, Privacy, Terms, Cookie policy; visible site identity.
- **UX:** Real navigation; mobile-friendly; fast load; ads must not mimic primary CTAs or navigation.
- **Placement:** In-content or sidebar placements **below** the fold or after meaningful paragraphs; avoid aggressive above-the-fold ad density.
- **Technical:** `ads.txt` (when approved), consistent canonical URLs, `robots.txt` / sitemap—see `scripts/generate-seo-assets.js` and `frontend/public/`.

**Important:** Approval depends on Google’s review; code structure alone does not guarantee approval.

## Analytics

- Client-side optional tags (GA4, GTM, Meta, Clarity) are wired via **`VITE_*`** variables—see `.env.example` and `frontend/src/analyticsClient.js`.
- Use a single `track` / event helper pattern so CTAs and forms stay measurable.
- Respect consent rules for your jurisdiction (GDPR, CPRA, etc.) before loading non-essential tags.

## AI site operator (Custom GPT / assistant)

- **Do not** give an assistant unrestricted production write access.
- Prefer: **preview → diff → approval → publish** (git or CMS), with audit logs.
- **Full instruction template:** `docs/CUSTOM_GPT_SITE_OPERATOR.md`

## Security

- **Never** commit API keys, tokens, or client secrets. Rotate any credential that was pasted in chat or exposed in history.
- Admin surfaces: **server-validated** sessions and secrets; client-only “passcode” is not sufficient as sole protection.
- Document required variables only by **name** in `.env.example` and `docs/DEPLOYMENT.md`.

## Deployment (Cloudflare Pages)

1. Create the **Pages** project in Cloudflare (name must match `wrangler pages deploy --project-name`).
2. Set build: `npm ci` / `npm run build`, output directory `dist`.
3. Set non-secret `VITE_*` analytics IDs in the Pages environment.
4. Run locally: `npm run build` then `npx wrangler pages deploy dist --project-name <actual-project-name>`.

See `docs/DEPLOYMENT.md` for detailed steps.

## Verification commands

```bash
npm install
npm run validate:env
npm run lint
npm run typecheck
npm run test
npm run build
```

Optional: `npm run format:check` before wide formatting changes.

## Git workflow

- Commit in logical phases (tooling, features, docs).
- Push when remote credentials allow; merge to `main` triggers CI (see `.github/workflows/ci.yml`).
