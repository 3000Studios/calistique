# Calistique — Agent Instructions

## Overview

- **Domain:** calistique.xyz
- **Stack:** React 19 + Vite + Express backend + Firebase Auth + Stripe payments
- **Deploy:** Cloudflare Pages (frontend) + local/CF Workers (server)
- **Package Manager:** npm
- **Description:** AI-powered luxury platform with storefront, blog, admin dashboard, and OpenClaw AI assistant

## Key Commands

```bash
npm install
npm run dev             # Frontend (Vite) + backend (Express) via concurrently
npm run dev:frontend    # Vite frontend only
npm run dev:server      # Express server only (--watch)
npm run build           # Vite production build (runs SEO asset gen via prebuild)
npm run lint            # ESLint with cache
npm run lint:fix        # ESLint autofix
npm run typecheck       # tsc --noEmit
npm run test            # Platform verify + vitest run
npm run test:unit       # Vitest only
npm run format          # Prettier write
npm run deploy          # CLI deploy script
npm run ci              # Full pipeline: validate:env + lint + typecheck + test + build
```

## Structure

- `frontend/` — React JSX components, pages, and app entry
  - `frontend/src/` — App.jsx, main.jsx, stores
  - `frontend/components/` — UI components (Navigation, Stripe, Cart, 3D, etc.)
  - `frontend/pages/` — Route pages (Blog, Products, Admin, Checkout, etc.)
  - `frontend/pages/admin/` — Admin dashboard pages
  - `frontend/backgrounds/` — Visual backdrop components
  - `frontend/context/` — React context providers
- `server/` — Express API server
- `api/` — Backend endpoints and AI handlers (Gemini)
- `engine/` — AI service modules
- `ai/` — AI scheduler, content generator, traffic engine, SEO analyzer
- `worker/` — Cloudflare Worker code
- `content/blog/` — Blog content JSON files
- `scripts/` — CLI tools, deploy, SEO generation, housekeeping
- `public/` — Static assets
- `dist/` — Build output

## Integrations

- **Firebase Auth** — Google login, user accounts
- **Stripe** — Payments, subscriptions, checkout
- **Google Gemini** — AI content generation
- **OpenAI** — AI assistant (OpenClaw)
- **Cloudflare R2** — Media storage

## Git Hooks

- **Husky** pre-commit configured
- **lint-staged** runs Prettier + ESLint on staged files

## Constraints

- Deploy through Cloudflare only
- Secrets from global.env, never hardcode
- Frontend code lives in `frontend/` — not `src/`
- JSX files (not TSX) — project uses JavaScript with JSX, TypeScript for typechecking only
- Admin routes under `/admin/` require authentication
- Blog content stored as JSON in `content/blog/`
- AI scheduler runs on cron — check `ai/scheduler/` before modifying
- Multiple AI providers (Gemini + OpenAI) — route through `ai/router/modelRouter.js`
