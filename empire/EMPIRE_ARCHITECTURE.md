# EMPIRE CORE (Citadel System) — Architecture + Operations

## Apps

- **citadel-core**: central command dashboard, traffic routing, monetization overview, cross-site trends.
- **referrals-live**: referral marketplace + monetization entrypoints.
- **theunitedstates-site**: SEO/news publishing system + category surfaces.
- **tmack48-media**: media engine for video/music/live stream UI.

## Shared platform systems

Located in `packages/shared/src/index.ts`:

- cross-site trending feed generation
- traffic loop router (`referrals -> usa -> media -> citadel`)
- shared tag taxonomy
- template-based article generation primitive
- monetization block catalog

## Required monetization coverage

Each app includes:

1. AdSense script in head
2. `public/ads.txt`
3. monetization UI slots for affiliate/sponsored/premium/donation/subscription/store/lead funnels/video overlays/game hooks

## SEO system

Per app public assets:

- `robots.txt`
- `sitemap.xml`
- metadata + OG tags in `index.html`

## Visual + interaction baseline

Per app includes:

- 3D scene via Three.js (`SceneCanvas`)
- Framer Motion animated hero typography
- animated gradients and custom scrollbar
- reusable feature systems for search/auth/media/games monetization hooks

## Autonomous content engine

`npm run content:tick` writes simulated hourly cross-site content payload (`content-feed.json`) and can be replaced with an AI generation backend.

## Provisioning workflow

```bash
cd empire
npm install
npm run build:apps
./scripts/bootstrap-github-repos.sh <github-username>
# For each app repo directory:
# git push -u origin main
wrangler login
./scripts/bootstrap-cloudflare-pages.sh
```

## Cloudflare domains target

- `referrals.live`
- `theunitedstates.site`
- `tmack48.media`
- `citadel.app`

## Notes

- This workspace is source-of-truth for all four properties.
- You can split each app to independent repos while keeping architecture parity by mirroring app folders.
