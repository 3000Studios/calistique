# Cursor Agent Best Settings (Low Cost + High Output)

This repository now includes a practical baseline for cost-efficient, highly automated agent operation.

## Files Added

- `.cursor/settings.json`
- `.cursor/mcp.json`
- `.cursor/hooks/pre-commit-check.sh`

## What This Optimizes

1. **Lower token spend by default**
   - Prompts agents to prefer the fastest model for routine edits.
   - Keeps context focused on touched files and fast checks first.
2. **Higher success rate on autonomous tasks**
   - Auto-run and trusted-workspace assumptions for this repo.
   - Fast verification path (`lint`, unit tests, build) before expensive full checks.
3. **Safer automation**
   - Pre-commit gate catches lint/test/build issues before bad commits spread.
   - Prevents common accidental waste loops.

## MCP Server Configuration

The included `.cursor/mcp.json` wires common high-value servers:

- `filesystem` (repo-aware local file operations)
- `github` (PR/issues/repo context)
- `cloudflare` (Pages/Workers docs and actions)
- `sentry` (error triage and investigation)
- `stripe` (billing and payment operations)
- `exa` (web search/fetch for current research)

These are configured as **templates** and expect secrets through environment variables.

### Required Variables (set outside git)

- `GITHUB_TOKEN`
- `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- `SENTRY_AUTH_TOKEN`
- `STRIPE_SECRET_KEY`
- `EXA_API_KEY`

Keep these in your local secret files and/or secure platform secret managers.

## Hook Automation

`./.cursor/hooks/pre-commit-check.sh` runs:

1. `npm run lint`
2. `npm run test:unit`
3. `npm run build`

Use this as a local hook or call it from your CI to keep output quality high while avoiding repeated full-stack expensive runs.

## Cursor UI Settings To Pair With This

In Cursor Settings:

1. **Workspace trust**: enabled for this repo.
2. **Agents > Auto-run**:
   - terminal commands: enabled
   - file edits: enabled
3. **Approval policy**:
   - keep confirmation for destructive commands only
4. **Model policy**:
   - default to faster model for routine coding/search
   - escalate only for deep architecture or long-form reasoning

## Cost Control Playbook

Use this command progression for best token efficiency:

1. `npm run lint`
2. `npm run test:unit`
3. `npm run build`
4. Only then run: `npm run check:full` (when release-critical)

## Important

- There is no single universal Cursor JSON key for every auto-approve toggle across all Cursor versions.
- The included `.cursor/settings.json` captures sane defaults, but always verify final behavior in the Cursor UI for your installed version.
