#!/usr/bin/env bash
set -euo pipefail

# Requires: wrangler login completed first

# Primary standardized domain profile: 3000studios.vip
# Legacy custom domains can be attached as aliases after primary mapping.
declare -A PROJECT_DOMAIN=(
  [citadel-core]="3000studios.vip"
  [referrals-live]="referrals.3000studios.vip"
  [theunitedstates-site]="usa.3000studios.vip"
  [tmack48-media]="media.3000studios.vip"
)

for project in "${!PROJECT_DOMAIN[@]}"; do
  domain="${PROJECT_DOMAIN[$project]}"
  echo "--- Cloudflare Pages: ${project} ---"
  wrangler pages project create "$project" --production-branch main || true
  wrangler pages deploy "apps/${project}/dist" --project-name "$project"
  echo "Attach custom domain in Cloudflare Pages: ${domain}"

done
