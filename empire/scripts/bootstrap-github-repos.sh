#!/usr/bin/env bash
set -euo pipefail

USERNAME="${1:-}"
if [[ -z "$USERNAME" ]]; then
  echo "Usage: ./scripts/bootstrap-github-repos.sh <github-username>"
  exit 1
fi

REPOS=(
  "citadel-core"
  "referrals-live"
  "theunitedstates-site"
  "tmack48-media"
)

for repo in "${REPOS[@]}"; do
  echo "--- Preparing ${repo} ---"
  APP_DIR="apps/${repo}"
  if [[ ! -d "$APP_DIR" ]]; then
    echo "Missing app directory: $APP_DIR"
    exit 1
  fi

  pushd "$APP_DIR" >/dev/null
  git init
  git branch -M main
  git add .
  git commit -m "Initial ${repo} build from EMPIRE CORE" || true
  git remote remove origin >/dev/null 2>&1 || true
  git remote add origin "https://github.com/${USERNAME}/${repo}.git"
  echo "Ready to push: git push -u origin main"
  popd >/dev/null

done

echo "All app repos initialized with remotes."
