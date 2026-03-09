# template-screen-react

Vite + React + TypeScript template for scaffolding new Phystack screen apps via `@phystack/cli`.

## Overview

This repository is a project template, not a deployable application. When a developer runs `phy app create`, the CLI clones this template to bootstrap a new React-based screen app with the Phystack hub-client integration, settings schema system, and analytics wiring already in place.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 18+ |
| Framework | React 18, Vite 7 |
| Language | TypeScript 5.9 (strict) |
| Styling | Styled Components 5 |
| Hub integration | @phystack/hub-client |
| Build target | ES2015 (Tizen 4 compatible) |

## Prerequisites

- Node.js 18+
- Yarn 1.x (enforced via preinstall hook)
- [@phystack/cli](https://www.npmjs.com/package/@phystack/cli)

## Getting Started

After scaffolding a new app from this template:

```bash
cd screen/<your-app>
yarn install
yarn dev
```

The dev server generates settings from schema defaults, starts Vite with HMR on `http://localhost:3000`, and watches for schema changes.

## Usage

The `@phystack/cli` uses this template when creating a new React screen app:

```bash
phy app create --template react
```

The CLI clones this repository into the target directory and the developer customizes the schema, components, and styles for their specific screen app.

## Settings Schema

Edit `src/schema.ts` to define app settings. JSDoc `@default` annotations generate the local development settings automatically:

```typescript
export interface Settings {
  /** @title Product Name  @default "My Product" */
  productName: string;
}
```

To use real installation data instead of schema defaults:

```bash
yarn download-settings <installation-name>   # persistent, gitignored
rm src/settings/index.json                    # revert to schema defaults
```

## Project Structure

```
src/
  App.tsx               # Main React component
  main.tsx              # Entry point (createRoot)
  schema.ts             # Settings schema (source of truth)
  analytics-schema.ts   # Analytics dashboard configuration
  utils/
    dev-mode.ts         # Priority-based settings loader
scripts/
  init-settings.js      # Pre-dev settings generation
  build-schema.js       # Schema build step
  build-analytics-schema.js
  post-build.js         # Asset manifest + build processing
meta/                   # App screenshots for marketplace
DESCRIPTION.md          # Marketplace description
vite.config.ts          # Vite config with Node.js polyfills
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Start dev server with auto-settings initialization |
| `yarn build` | Production build (TypeScript, Vite, schema, post-processing) |
| `yarn lint` | Run ESLint |
| `yarn preview` | Preview production build locally |
| `yarn schema` | Generate settings and analytics schemas |
| `yarn download-settings <name>` | Download settings from a Phystack installation |
| `yarn pub` | Publish app to Phystack |

## Testing

No test suite is included in the template. Individual screen apps should add tests as needed.

## Troubleshooting

**Settings not loading** -- Delete `src/settings/` and re-run `yarn dev` to regenerate from the schema.

**Build fails** -- Remove `build/` and `node_modules/`, then `yarn install && yarn build`.

**Vite HMR not working** -- Ensure port 3000 is free, then clear the Vite cache with `rm -rf node_modules/.vite` and restart.

## Related Documentation

- [CLAUDE.md](./CLAUDE.md) -- detailed build process, browser compatibility notes, and React patterns
- [@phystack/cli](https://www.npmjs.com/package/@phystack/cli)
- [Phystack developer docs](https://build.phystack.com/)
- [Vite](https://vitejs.dev/) | [React](https://react.dev/) | [Styled Components](https://styled-components.com/)
