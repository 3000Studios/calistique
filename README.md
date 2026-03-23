# Camp Dream GA / MyAppAI

Camp Dream GA is a Vite + React public site with a local Express admin/API layer, Cloudflare Pages deployment support, analytics hooks, monetization scaffolding, and an operator command workflow for structured or natural-language site updates.

## Quick start

```bash
npm install
Copy-Item .env.example .env
npm run cli:doctor
npm run dev
```

The local app runs with:

- public site on `http://localhost:5173`
- local API/admin server on `http://127.0.0.1:8787`

## Core commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run cli:doctor
npm run cli -- command "refresh the homepage hero copy"
npm run cli -- pages:list
npm run cli:deploy
```

## Environment files

- `.env.example` is the canonical local template.
- `.dev.vars.example` is the canonical Cloudflare Pages secret template.
- `wrangler.toml` contains only non-secret deployment defaults.

Never commit `.env`, `.env.local`, or `.dev.vars`.

## Cloudflare Pages

This repo expects a Pages project defined by:

- `CLOUDFLARE_PAGES_PROJECT_NAME`
- `CLOUDFLARE_PAGES_BRANCH`

Default values are `campdreamga` and `main`.

If that project does not exist yet, create it with:

```bash
npm run pages:project:create
```

Then deploy with:

```bash
npm run cli:deploy
```

## Documentation

- `docs/DEPLOYMENT.md`
- `docs/ARCHITECTURE_AND_ADSENSE.md`
- `docs/CUSTOM_GPT_SITE_OPERATOR.md`
- `docs/MASTER_1_ULTRA_PROMPT.md`
