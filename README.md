# template-screen-react

Starter template for PhyStack **SCREEN** apps — Vite + React front-end
bundles running full-screen on PhyOS screens, connected to the platform
through `@phystack/hub-client`. Scaffolded by the PhyStack CLI
(`phy app init --type screen`) or usable directly.

## Getting started

```bash
# Scaffold via the PhyStack CLI
phy app init my-screen-app --type screen

# Or work directly from this template
bun install
bun run build
```

## Local development (simulator)

```bash
npm i -g @phystack/device-simulator   # once — provides the phy-simulator binary
bun run dev                           # simulated device on :55000 + vite dev server
```

`bun run dev` runs `phy-simulator run .`, which starts the local simulated
device, launches the vite dev server, and opens the app in your browser with
the instance id in the URL hash (`/#instanceId=…`) — that's how hub-client
knows which twin the page is. Settings defaults are seeded from the schema
by `scripts/init-settings.js`.

## Flow

```bash
# 1. Edit src/schema.ts (installation settings), src/analytics-schema.ts (events), src/App.tsx (UI)
# 2. Local build: typecheck + vite build + schemas into build/
bun run build

# 3. Register the app in your tenant (once)
phy app create my-screen-app --type screen

# 4. Submit + publish the build (no container image for screen apps)
bun run pub
```

`pub` runs `phy app build create $npm_package_name --dir . --publish` — the
vite bundle and generated schemas are packaged and published as soon as the
build processes.

## Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Simulator + vite dev server (`phy-simulator run .`) |
| `bun run start` | Schemas + vite dev server only (expects a running simulator) |
| `bun run build` | `tsc -b` + `vite build` + schemas + bundle post-processing |
| `bun run schema` | Generate `build/schema.json`, `meta-schema.json`, `analytics-schema.json` |
| `bun run pub` | Build, then submit + publish via the `phy` CLI |
| `bun run lint` | eslint |
| `bun run format` | prettier (`format:check` to verify only) |

## Layout

| Path | Purpose |
|------|---------|
| `src/App.tsx` | UI + hub-client connection (settings, twin messaging, signals) |
| `src/schema.ts` | Installation-settings schema (TypeScript → JSON Schema) |
| `src/analytics-schema.ts` | Analytics events this app emits |
| `scripts/` | Schema build, local settings seed, post-build bundle fixup |
| `vite.config.ts` | Dev server (port 3000) + simulator hand-off via `#instanceId` |

## Web sibling

[template-mobile](https://github.com/phystack/template-mobile) is this
template with `application-type: web` plus a PWA layer, and nothing else
different. If you change one template, change both.
