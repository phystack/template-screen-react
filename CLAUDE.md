# PhyStack Screen App Template

Vite + React 18 + TypeScript template for PhyStack Grid Apps (kiosks, digital signage, Tizen TVs).

Run `/setup` to configure for a new app. Run `/feature NNN-name` for TDD development.

## Commands

```bash
# Development
yarn install          # Install dependencies (yarn only, enforced)
yarn dev              # Dev server on localhost:3000
yarn lint             # ESLint
yarn test             # Vitest (also: test:watch, test:coverage)

# Build & Deploy
yarn build            # Full build: schema -> tsc -> vite -> post-build
yarn schema           # Generate settings/analytics schemas only
yarn preview          # Preview production build locally

# Settings
yarn download-settings <installation>  # Download real settings to src/settings/index.json

# Publishing
yarn pub              # Publish to PhyStack Grid
yarn upload-description
yarn connect          # Dev WebSocket
```

## Publishing

**IMPORTANT:** Before `yarn pub`, you MUST run `/stability-audit` first. These apps run on always-on, unattended hardware — a leaked timer or unclosed stream will crash the device with no one to restart it.

1. `yarn build` — ensure build succeeds
2. `/stability-audit` — fix critical/high issues
3. `yarn pub` — publish

## Git Commit Guidelines

DO NOT add "Co-Authored-By: Claude" or similar attribution to commits.

## Settings System

Two-file priority system — `src/schema.ts` is the single source of truth:

1. **`src/settings/index.json`** — Downloaded from real installations (`yarn download-settings`). Persistent, gitignored.
2. **`src/settings/.generated.json`** — Auto-generated from schema defaults on every `yarn dev`. Fallback when no downloaded settings exist.

Delete `src/settings/index.json` to revert to schema defaults.

## Environment

- **Node.js**: 18+
- **Package Manager**: Yarn only
- **Target**: ES2015 (Tizen 4 / Chromium ~56) — see `tizen-compat` rule for forbidden syntax
- **Styling**: Styled Components (unless app-specific CLAUDE.md says otherwise)

## PhyStack SDK

Full docs: https://build.phystack.com/llms-full.txt — fetch on-demand with `WebFetch` when working with PhyStack features.
