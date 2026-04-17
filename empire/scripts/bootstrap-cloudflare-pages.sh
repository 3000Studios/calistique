#!/usr/bin/env bash
set -euo pipefail

# Requires: wrangler login completed first

declare -A PROJECT_DOMAIN=(
  [citadel-core]="citadel.app"
  [referrals-live]="referrals.live"
  [theunitedstates-site]="theunitedstates.site"
  [tmack48-media]="tmack48.media"
)

for project in "${!PROJECT_DOMAIN[@]}"; do
  domain="${PROJECT_DOMAIN[$project]}"
  echo "--- Cloudflare Pages: ${project} ---"
  wrangler pages project create "$project" --production-branch main || true
  wrangler pages deploy "apps/${project}/dist" --project-name "$project"
  echo "Attach custom domain in dashboard: ${domain}"

done
