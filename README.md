# template-screen-react

Vite + React + TypeScript template for scaffolding new PhyStack screen apps via `@phystack/cli`.

## Overview

This repository is a project template used by `@phystack/cli` to scaffold new screen apps. Screen apps are web-based applications that run across PhyOS devices, Tizen displays, and modern browsers, providing user-facing graphical interfaces for interacting with PhyStack services and connected devices.

This template does not deploy anywhere on its own.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 24 |
| Framework | React 18, Vite 7 |
| Language | TypeScript 5.9 (strict) |
| Styling | Styled Components 5 |
| Hub integration | @phystack/hub-client |
| Analytics | @ombori/grid-reports |
| Build target | ES2015 (Tizen 4 compatible) |

## Prerequisites

- Node.js 24+ (see `.nvmrc`)
- Yarn 1.x (enforced via preinstall hook)
- `@phystack/cli` installed globally (`npm i -g @phystack/cli`)

## Getting Started

This template is used automatically when you create a new screen app with the CLI:

```bash
phy app create
```

Select **Screen Application (React)** when prompted. The CLI will scaffold a new project from this template and install dependencies.

### Run Locally with the Simulator

Start the simulator server, then launch your app against it:

```bash
phy simulator start
```

```bash
yarn dev
```

This creates a local simulated twin based on your settings from `src/settings/index.json` (generated from `schema.ts` defaults if the file doesn't exist) and starts the Vite dev server. Your browser will open automatically at http://localhost:3000 with the app connected to the simulator.

### Build and Publish

Build the `.gridapp` package:

```bash
yarn build
```

Publish to your tenant:

```bash
yarn pub
```

For the full walkthrough, see the [Build A Screen App](https://build.phystack.com/tutorials/build-your-first-screen-app/) tutorial.

## Project Structure

```
src/
  App.tsx               # Main React component
  main.tsx              # Entry point (createRoot)
  schema.ts             # Settings schema (source of truth)
  analytics-schema.ts   # Analytics dashboard configuration
  index.css             # Global styles
scripts/
  init-settings.js      # Pre-dev settings generation
  build-schema.js       # Schema build step
  build-analytics-schema.js  # Analytics schema build step
  post-build.js         # Asset manifest + build processing
meta/                   # App screenshots for marketplace
DESCRIPTION.md          # Marketplace description
vite.config.ts          # Vite config with simulator support and Node.js polyfills
```

## Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Run the app locally with the simulator (`phy simulator run .`). Automatically generates settings from schema if missing (via `predev` hook). |
| `yarn start` | Generate schema and start the Vite dev server directly |
| `yarn build` | Production build (TypeScript, Vite, schema, post-processing, `.gridapp` packaging) |
| `yarn pub` | Publish the `.gridapp` to your tenant |
| `yarn schema` | Generate settings and analytics schemas |
| `yarn lint` | Run ESLint |
| `yarn format` | Format code with Prettier |
| `yarn upload-description` | Upload the app description to your tenant |

## Troubleshooting

**Settings not loading** -- Delete `src/settings/` and re-run `yarn dev` to regenerate from the schema.

**Build fails** -- Remove `build/` and `node_modules/`, then `yarn install && yarn build`.

**Vite HMR not working** -- Ensure port 3000 is free, then clear the Vite cache with `rm -rf node_modules/.vite` and restart.

## Related Documentation

- [Build A Screen App](https://build.phystack.com/tutorials/build-your-first-screen-app/) -- step-by-step tutorial
- [Settings Schemas](https://build.phystack.com/phystack-concepts/settings-schemas/) -- how settings and schemas work
- [Reports](https://build.phystack.com/phystack-concepts/reports/) -- analytics dashboard configuration
- [Dev Environment Setup](https://build.phystack.com/getting-started/dev-environment-setup/) -- CLI installation and simulator setup
