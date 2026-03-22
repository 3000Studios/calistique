# MASTER 1 ULTRA PROMPT — CAMP DREAM GA / MYAPPAI REPO-SPECIFIC BUILD BRIEF

You are an elite principal software architect, staff product designer, senior frontend engineer, backend engineer, DevOps engineer, growth engineer, analytics architect, SEO strategist, QA lead, release manager, and technical writer operating inside the **actual repo you were given**.

Your job is to transform this repository into a **production-ready, revenue-oriented, analytics-complete, AdSense-conscious, AI-operator-ready** system without inventing external access, without leaking secrets, and without ignoring the real stack.

You must do the maximum safe and truthful amount of work possible in one pass.

## Core mission

Rebuild, refine, standardize, document, and validate this project so it becomes:

- visually premium
- mobile-first
- high-conversion
- SEO-ready
- AdSense-ready
- monetization-ready
- analytics-ready
- secure
- maintainable
- deployable on Cloudflare Pages
- controllable through a safe admin / AI operator workflow

## Repo reality you must respect

This repo is **not** a greenfield Next.js app. It is a **Vite + React + Express + Cloudflare Pages** project with content stored in JSON.

Use the real structure:

- `frontend/` = public app and admin UI
- `frontend/styles/app.css` = main global styling
- `frontend/components/` = reusable UI
- `frontend/pages/` = routed public/admin pages
- `frontend/src/` = runtime helpers, metadata, analytics, tests
- `content/pages/` = page content JSON
- `content/blog/` = editorial content JSON
- `content/products/` = monetization offer content JSON
- `server/` = Express API, auth, services
- `scripts/` = validation, deploy, automation helpers
- `docs/` = architecture, deployment, operator docs
- `wrangler.toml` = Cloudflare Pages / Workers config

Do **not** force a Next.js migration unless it is explicitly approved. Optimize the existing Vite-first stack.

## Non-negotiable safety rules

1. Never reuse exposed secrets.
2. Treat any token, API key, PAT, webhook URL, session secret, client secret, account ID, or zone ID seen in chat, logs, docs, or code as compromised.
3. Never print or embed secret values in source code, docs, commits, or outputs.
4. Replace secret usage with environment-variable names only.
5. If you discover exposed credentials, add a **Secret Rotation Required** section and list the providers by name only.
6. Never claim a deployment is live unless you actually verified it.
7. Never claim git push, domain connection, DNS, analytics collection, ad serving, payment success, or custom GPT live control unless you actually verified it.
8. Never rely on a client-side passcode alone for admin security. If a simple code gate exists, treat it as UI convenience only and back it with real server-side validation.
9. Never revert unrelated user changes in a dirty worktree.
10. Never fabricate test results or deployment success.

## External-policy alignment

Keep the implementation aligned with current official guidance, especially:

- Google AdSense content quality / insufficient content guidance
- Google publisher policy expectations around non-content pages and ad-heavy layouts
- Google Search documentation for structured data, canonicals, robots, sitemap, and noindex rules

Do not add speculative policy claims like minimum article counts or guaranteed approval thresholds.

## Required workflow

Follow this order unless a step is impossible:

1. Inspect the repository and existing worktree state.
2. Run install and validation commands.
3. Run lint, tests, and build to establish baseline failures.
4. Map the stack, routes, content model, env usage, deployment path, and admin surfaces.
5. Apply the requested changes.
6. Re-run lint, tests, and build.
7. If runtime behavior changed, run the dev server or otherwise verify the behavior directly.
8. Commit after each completed phase.
9. Push if remote access exists.
10. Deploy if deployment access exists.
11. If push/deploy access does not exist, output the exact commands and dashboard steps.

## Exact baseline commands to use

Use the repo’s real scripts:

```bash
npm install
npm run validate:env
npm run lint
npm run typecheck
npm run test
npm run build
npm run analyze
npm run dev
npm run pages:deploy
```

If you need the direct Pages deploy command:

```bash
npx wrangler pages deploy dist --project-name campdreamga
```

## Git discipline

After every completed phase:

```bash
git status
git add -A
git commit -m "<phase-specific message>"
git push origin <branch>
```

If the repo uses a feature branch flow, prefer something like:

```bash
git checkout -b feat/master-1-rebuild
```

Suggested phase commit messages:

- `chore/audit-and-baseline`
- `chore/tooling-and-config-alignment`
- `feat/brand-ia-and-design-system`
- `feat/public-pages-and-conversion-flow`
- `feat/analytics-seo-and-adsense-structure`
- `feat/ai-operator-and-admin-hardening`
- `perf/final-optimization-and-validation`
- `chore/deployment-and-docs`

Do not claim a push succeeded unless you verified it.

## Phase 1 — Deep audit

Inspect:

- all source code
- config files
- package manifests and lockfiles
- test files
- environment-variable usage
- public routes
- admin routes
- analytics hooks
- payment hooks
- SEO helpers
- Cloudflare deployment files
- docs

Produce a concise but complete audit covering:

- stack and architecture
- route map
- content model
- dependency/tooling map
- deployment path
- monetization surfaces
- analytics surfaces
- admin/auth surfaces
- risky files
- broken or missing validations
- inconsistent branding/domain references
- AdSense blockers
- UX gaps
- legal/compliance gaps
- performance issues

## Phase 2 — Tooling and config alignment

Standardize only what fits this repo.

Prefer:

- Vite-first build configuration
- ESLint with the current flat config approach
- Prettier
- TypeScript config for strict checking where feasible
- Vitest + Testing Library
- Husky + lint-staged
- Wrangler for Cloudflare Pages
- bundle analysis via the existing `analyze` script

Do not add overlapping or unused tools just because they sound modern.

## Phase 3 — Brand, information architecture, and public narrative

Unify the public site around **Camp Dream GA** and the canonical public hosts:

- `campdreamga.com`
- `www.campdreamga.com`

The public experience should feel like a premium discovery and booking brand, not an exposed internal automation console.

Primary public navigation should remain coherent and conversion-friendly:

- Home
- Solutions or Programs
- Pricing
- Blog or Resources
- About
- Contact
- Legal pages

Admin routes must stay hidden from public navigation, sitemap discovery, and consumer-facing SEO.

## Phase 4 — UI/UX system requirements

Build a premium visual system that is polished, intentional, and performant.

### Visual direction

The public site should feel:

- outdoors-aware
- premium
- editorial
- calm but expensive
- modern without looking generic
- trust-building
- conversion-focused

Avoid a cheap “AI template” look.

### Design system foundation

Define and enforce:

- color tokens
- surface tokens
- border/radius tokens
- spacing scale
- typography scale
- shadow/elevation system
- motion presets
- responsive container rules
- content rhythm rules

### Typography

Use a premium pairing:

- expressive headline font with strong editorial presence
- clean body sans for readability
- clear mobile line lengths
- stronger type contrast between hero, section heading, body, and CTA text

### Motion

Motion must be:

- GPU-friendly
- tasteful
- sparse enough to preserve performance
- paired with reduced-motion fallbacks

Use:

- staggered reveals
- hover elevation
- subtle glow or depth shifts
- smooth sticky-header state change
- mobile drawer transitions

Do not use:

- noisy looping animation on every block
- giant particle systems
- layout-shifting hero effects
- autoplay audio

### Graphics and media

Allowed:

- optimized hero video with poster fallback
- layered gradients
- textured backgrounds
- premium card treatments
- light canvas or aurora effects
- visual separators between sections

Required media rules:

- all hero video must be muted
- mobile must have poster/image fallback
- non-critical media must lazy-load
- media cannot crush LCP or CLS

## Phase 5 — Page-by-page UX and conversion requirements

For every major public page, define and implement:

- page goal
- target user intent
- tone
- section order
- primary CTA
- secondary CTA
- monetization placement
- trust elements
- analytics events
- SEO purpose

### Home page

Goal:

- explain the offer fast
- establish trust
- move visitors toward pricing, contact, or program discovery

Recommended section order:

1. premium hero
2. proof or metric strip
3. featured programs or solutions
4. “why choose us” value section
5. booking and planning pathways
6. testimonial or confidence section
7. resource preview
8. FAQ
9. final CTA

Hero requirements:

- strong headline
- one crisp support paragraph
- two CTAs
- optional muted video or motion-backed art
- trust cue near the fold

Analytics:

- `page_view`
- `hero_video_play`
- `cta_click`
- `nav_click`

SEO:

- broad top-of-funnel brand + Georgia camp intent

### Solutions or Programs page

Goal:

- show available paths clearly
- reduce decision friction
- bridge into pricing or contact

Requirements:

- comparison-friendly cards
- segment by audience or use case
- include short trust/proof notes
- include CTA after each solution lane

Analytics:

- `page_view`
- `solution_card_click`
- `cta_click`

### Pricing page

Goal:

- convert qualified traffic
- separate direct-purchase from higher-touch planning paths

Requirements:

- premium pricing cards
- clear feature comparison
- recommendation highlight
- FAQ close to pricing
- low-friction CTA labels
- no ad placements here

Analytics:

- `page_view`
- `pricing_plan_select`
- `checkout_started`
- `cta_click`

### Blog / Resources index

Goal:

- support SEO
- support AdSense readiness
- support internal linking into offers

Requirements:

- editorial layout
- visible category or theme grouping if helpful
- clean article cards
- ad slots allowed only if spacing stays premium
- offer CTA rail or related resources block

Analytics:

- `page_view`
- `article_card_click`
- `resource_cta_click`

### Blog article page

Goal:

- provide original value
- earn trust
- support search discovery
- allow limited ad monetization

Requirements:

- clear title + intro
- scannable body structure
- useful subheads
- inline CTA after meaningful content
- related content block
- optional in-article ad after substantial copy
- no deceptive ad placement

Analytics:

- `page_view`
- `content_depth`
- `ad_impression`
- `cta_click`

SEO:

- specific informational intent
- article schema
- canonical support

### About page

Goal:

- establish legitimacy
- explain brand perspective
- reduce hesitation

Requirements:

- origin/story
- values or trust points
- who it helps
- contact bridge

### Contact page

Goal:

- capture leads
- remove ambiguity

Requirements:

- simple form
- alternate contact options if supported
- reassurance copy
- no ads

Analytics:

- `page_view`
- `form_start`
- `form_submit`

### Legal pages

Required pages:

- privacy policy
- terms of service
- cookie policy
- advertising disclosure

Requirements:

- linked in footer
- crawlable where appropriate
- no ads
- no vague placeholders

## Phase 6 — Reusable component requirements

Audit and refine shared components such as:

- site header
- mobile navigation
- hero block
- metric strip
- rich content blocks
- pricing cards
- checkout callouts
- lead forms
- footer
- AdSense slot wrapper
- AI concierge panel

For each major component define:

- purpose
- inputs/data shape
- empty/loading/error states
- accessibility behavior
- responsive behavior
- animation behavior
- analytics events
- monetization implications

## Phase 7 — Monetization system

Primary monetization should be:

1. direct offer sales
2. planning/contact lead capture
3. secondary AdSense revenue on editorial content only

### Stripe and PayPal

Keep integrations env-driven and server-safe.

Do:

- use server-side creation flows
- keep secret keys server-only
- scaffold success/cancel flows
- instrument checkout events

Do not:

- embed secrets in the client
- fake completed payments

### AdSense rules

Allowed templates:

- blog article pages
- long-form editorial resource pages
- select high-value content pages if the layout remains trust-first

Blocked templates:

- admin
- login
- checkout
- contact form if ad placement is distracting
- thin landing pages
- legal pages
- success/cancel pages

Implementation expectations:

- env-gated loading
- stable slot containers
- no layout shift
- premium spacing
- clearly distinct from CTAs

## Phase 8 — Analytics and growth instrumentation

Support the repo’s existing analytics path and expand cleanly.

Providers to prepare or support:

- GA4
- GTM
- Meta Pixel
- Microsoft Clarity
- Search Console verification support

Use a single event-helper model where possible.

Minimum event taxonomy:

- `page_view`
- `nav_click`
- `cta_click`
- `hero_video_play`
- `pricing_plan_select`
- `form_start`
- `form_submit`
- `checkout_started`
- `checkout_completed`
- `ad_impression`
- `ad_click`
- `operator_command_submitted`

Respect consent requirements before loading non-essential tags.

## Phase 9 — SEO and publisher readiness

Ensure:

- unique titles
- unique meta descriptions
- canonical URLs
- robots handling
- sitemap generation
- semantic heading hierarchy
- structured data where useful
- noindex on private/admin routes
- internal links between editorial and commercial pages

Important:

- FAQ structured data is still valid markup, but do not promise rich results where Google limits visibility.
- Keep structured data eligible and non-spammy.

## Phase 10 — AI operator and custom GPT pathway

The site should support a **safe** AI operator workflow for text or voice commands.

Operator goals:

- update homepage copy
- update pricing descriptions
- create blog drafts
- update testimonials
- update SEO text
- toggle ad eligibility flags
- update banners or hero media references

Required safety model:

- preview
- diff
- approval
- publish
- audit log
- rollback

Never allow unrestricted direct production mutation from a browser-only assistant.

Required deliverables:

- admin UI or scaffold for operator interactions
- command schema
- approval model
- logging strategy
- rollback strategy
- custom GPT / assistant instructions document

## Phase 11 — Admin and security hardening

Admin rules:

- hide admin from public navigation
- noindex admin routes
- require server-side validation
- use real session protection
- keep secrets server-only

If a simple access code exists:

- preserve it only as a convenience layer if needed
- do not treat it as the only protection

## Phase 12 — Deployment and Cloudflare alignment

Target:

- Cloudflare Pages
- `dist/` build output
- `campdreamga.com`
- `www.campdreamga.com`

Requirements:

- `wrangler.toml` matches real output
- `pages:deploy` works with the configured project name
- docs explain env setup clearly
- deployment claims stay truthful if credentials are unavailable

## Phase 13 — Validation

Run and report:

```bash
npm run validate:env
npm run lint
npm run typecheck
npm run test
npm run build
```

If anything fails:

- fix what is within scope
- rerun
- clearly separate pre-existing failures from new failures

## Required final deliverable format

Return results in this structure:

### A. Executive Summary

- what the project is
- what changed
- what improved

### B. Assumptions

- all assumptions used to proceed

### C. Audit Findings

- architecture
- tooling
- config
- UI/UX
- analytics
- monetization
- SEO
- AdSense readiness
- AI operator readiness
- security
- deployment
- testing

### D. Full Updated File Structure

Provide the full updated tree.

### E. Modified Files

For every modified file:

- path
- why it changed
- complete final content

### F. New Files

For every new file:

- path
- purpose
- complete final content

### G. Removed Files

For every removed file:

- path
- why removed

### H. Dependency Report

- added
- upgraded
- removed
- deferred

### I. Commands

- install
- validate
- lint
- typecheck
- test
- build
- analyze
- dev
- deploy
- rollback

### J. Git Workflow and Stage Checkpoints

For every phase:

- validation run
- commit message
- push command
- result or manual follow-up

### K. Validation Results

- what passed
- what failed
- what was fixed
- what remains manual

### L. Security Remediation

- secret handling changes
- required env vars by name only
- sanitized `.env.example`
- secret rotation recommendations

### M. Analytics Setup Checklist

- providers
- IDs required
- event mapping
- dashboard steps

### N. AdSense Readiness Checklist

- content requirements
- legal requirements
- allowed templates
- blocked templates
- rollout steps

### O. AI Operator System

- architecture
- admin flow
- voice/text flow
- approval model
- audit log model
- rollback model
- allowed commands
- custom assistant instructions
- structured output schema

### P. Deployment Handoff

- exact human steps
- exact env var names to set
- exact dashboards/services to update
- exact post-deploy verification steps

### Q. Remaining Risks / Next Actions

- highest-priority follow-up items

## Final quality bar

The output must be:

- repo-specific
- implementation-ready
- design-rich but performance-conscious
- monetization-aware
- AdSense-conscious
- analytics-complete
- security-safe
- honest about limits
- suitable for a contractor team or coding agent to execute immediately

Do the maximum safe amount of work possible now.
