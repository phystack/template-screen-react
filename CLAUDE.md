# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Project Overview

This is a modern Vite-based React TypeScript template for building Phystack Grid Apps. It replaces the old Create React App (CRA) template with a faster, more modern development experience while maintaining full compatibility with the Phystack Grid deployment infrastructure.

## Commands

### Development
```bash
yarn install    # Install dependencies (only yarn allowed, enforced via preinstall)
yarn dev        # Start dev server on http://localhost:3000 with auto-settings init
yarn preview    # Preview production build locally
yarn lint       # Run ESLint
```

### Building
```bash
yarn build      # Full production build: schema → TypeScript → Vite → post-processing
yarn schema     # Generate settings and analytics schemas only
```

### Settings Management
```bash
yarn download-settings <installation-name>  # Download settings from Phystack installation
# Settings are downloaded to src/settings/index.json (gitignored, persistent)
# Delete this file to revert to schema-generated defaults
```

### Deployment
```bash
yarn pub                    # Publish to Phystack Grid (via @phystack/cli)
yarn upload-description     # Upload DESCRIPTION.md to marketplace
yarn connect                # Connect to dev WebSocket
```

## Git Commit Guidelines

**IMPORTANT:** DO NOT add "Co-Authored-By: Claude" or any similar attribution to commit messages in this repository. Keep commits clean and professional without AI attribution.

## Settings System Architecture

### Priority-Based Settings

The template uses a modern **two-file settings system**:

1. **`src/settings/index.json`** (Priority 1)
   - Downloaded from real Phystack installations
   - Persistent across dev runs
   - Gitignored (user-specific)
   - Created via: `yarn download-settings <name>`

2. **`src/settings/.generated.json`** (Priority 2 - Fallback)
   - Generated from `src/schema.ts` defaults
   - Ephemeral (regenerated on every `yarn dev`)
   - Gitignored (auto-created)
   - Always kept fresh with schema changes

### Settings Loading Flow

```
yarn dev
  ↓
predev hook: node scripts/init-settings.js
  ↓
ALWAYS generate .generated.json from schema
  ↓
Check if index.json exists?
  ├─ YES → Use index.json (downloaded)
  └─ NO  → Use .generated.json (schema defaults)
  ↓
App.tsx loads settings via dev-mode.ts
  ↓
Try import index.json
  ├─ SUCCESS → Use downloaded settings
  └─ FAIL    → Use .generated.json
```

### Key Benefits

- ✅ Schema is single source of truth for defaults
- ✅ No manual `default.settings.json` to maintain
- ✅ Schema changes automatically reflected
- ✅ Easy switch between real and mock data
- ✅ Persistent downloaded settings when needed

## Build Process

The build pipeline follows this sequence:

```bash
yarn build
  ↓
1. yarn schema
   ├─ mkdirp build
   ├─ node scripts/build-schema.js
   │   └─ npx ts-schema src/schema.ts build/
   │       → build/schema.json (with defaults)
   │       → build/meta-schema.json
   └─ node scripts/build-analytics-schema.js
       └─ Compile src/analytics-schema.ts
           → build/analytics-schema.json
  ↓
2. tsc -b
   └─ TypeScript compilation check
  ↓
3. vite build
   ├─ Output to: build/
   ├─ Assets to: build/static/js/, build/static/css/, etc.
   └─ Uses vite.config.ts (with Node.js polyfills)
  ↓
4. node scripts/post-build.js
   ├─ Copy schema.json → _schema.json
   ├─ Copy analytics-schema.json → _meta-schema.json
   ├─ Generate asset-manifest.json (omg-deploys format)
   └─ Copy package.json to build/
```

### Build Output Structure

```
build/
├── static/
│   ├── js/              # Hashed JS bundles
│   ├── css/             # Hashed CSS files
│   └── svg/             # SVG assets
├── index.html           # Entry point
├── asset-manifest.json  # Deployment manifest
├── _schema.json         # Settings schema (omg-deploys format)
├── _meta-schema.json    # Analytics schema (omg-deploys format)
└── package.json         # Package metadata
```

## Vite Configuration

### Node.js Polyfills

The `vite.config.ts` includes polyfills for `@phystack/hub-client` (which is isomorphic):

```typescript
define: {
  'process.env': {},
  'process.version': JSON.stringify(''),
  'process.platform': JSON.stringify('browser'),
}

resolve: {
  alias: {
    events: 'events',
  },
}
```

### CRA Compatibility

Supports `PUBLIC_URL` environment variable for backward compatibility:

```typescript
const base = process.env.PUBLIC_URL || process.env.VITE_ROOT_PATH || './';
```

### Output Paths

Configured to match CRA/omg-deploys expectations:

```typescript
build: {
  outDir: 'build',  // Not 'dist'
  rollupOptions: {
    output: {
      entryFileNames: 'static/js/[name].[hash].js',
      chunkFileNames: 'static/js/[name].[hash].js',
      assetFileNames: 'static/[ext]/[name].[hash].[ext]',
    },
  },
}
```

## React Best Practices

This template follows **modern React 18 patterns**:

### DO ✅

- Use `createRoot()` API (not deprecated `ReactDOM.render()`)
- Use cleanup functions in `useEffect` with cancellation flags
- Include proper error state handling
- Use `type` imports for TypeScript types
- Keep effects simple with minimal dependencies
- Avoid unnecessary `useCallback`/`useMemo` (only optimize when needed)

### DON'T ❌

- Don't use `import React from 'react'` (not needed in modern React)
- Don't create complex dependency arrays that cause re-renders
- Don't use `useCallback` without measuring performance impact first
- Don't ignore cleanup in async effects (causes memory leaks)
- Don't use deprecated APIs like `ReactDOM.render()`

### Example: Proper useEffect Pattern

```typescript
useEffect(() => {
  let cancelled = false;  // Cleanup flag

  const initialize = async () => {
    try {
      const data = await fetchData();
      if (!cancelled) {  // Check before setState
        setState(data);
      }
    } catch (err) {
      if (!cancelled) {
        setError(err);
      }
    }
  };

  initialize();

  return () => {
    cancelled = true;  // Cleanup on unmount
  };
}, []); // Empty array - runs once
```

## Schema System

### Settings Schema (`src/schema.ts`)

Uses **JSDoc annotations** for schema generation:

```typescript
/**
 * @title App Settings
 */
export type Settings = {
  /**
   * @title Product Name
   * @default "My Product"
   */
  productName: string;
}
```

The `@default` values are extracted to generate `src/settings/.generated.json`.

### Analytics Schema (`src/analytics-schema.ts`)

Uses `@ombori/grid-reports` for dashboard configuration:

```typescript
import { AnalyticsSchema, CardType } from '@ombori/grid-reports';

const analyticsSchema: AnalyticsSchema = {
  groups: [
    {
      name: 'Overview',
      cards: [
        { type: CardType.Sessions },
      ],
    },
  ],
};

export default analyticsSchema;
```

## Deployment Compatibility

### omg-deploys Azure Functions

The template is compatible with `omg-deploys` which expects:

- ✅ `build/` directory (not `dist/`)
- ✅ `_schema.json` and `_meta-schema.json` in build root
- ✅ `asset-manifest.json` with files and entrypoints
- ✅ `package.json` in build directory

### @phystack/cli

Compatible with `phy` CLI commands:

```bash
phy app settings <installation>  # Download settings
phy app publish                   # Publish app
phy app upload-description        # Upload description
phy dev ws                        # Connect to dev WebSocket
```

## Common Tasks

### Adding a New Setting

1. Edit `src/schema.ts`:
```typescript
export type Settings = {
  // ... existing settings

  /**
   * @title New Setting
   * @default "default value"
   */
  newSetting: string;
}
```

2. Settings automatically regenerate on next `yarn dev`

3. Use in component:
```typescript
const { newSetting } = state.settings;
```

### Switching Between Real and Mock Data

```bash
# Use real installation data
yarn download-settings my-installation-123
yarn dev  # Uses downloaded settings

# Switch back to schema defaults
rm src/settings/index.json
yarn dev  # Uses .generated.json
```

### Testing Build Locally

```bash
yarn build      # Build production
yarn preview    # Preview at http://localhost:4173
```

## File Organization

### Do Not Commit
- `src/settings/index.json` - User-specific downloaded settings
- `src/settings/.generated.json` - Auto-generated from schema
- `build/` - Build output
- `node_modules/` - Dependencies

### Do Commit
- `src/schema.ts` - Settings schema (source of truth)
- `src/analytics-schema.ts` - Analytics configuration
- All scripts in `scripts/`
- `vite.config.ts` - Build configuration
- `DESCRIPTION.md` - App marketplace description
- `meta/` - App screenshots

## Troubleshooting

### Settings not loading

```bash
# Check what exists
ls -la src/settings/

# Regenerate from scratch
rm -rf src/settings/
yarn dev
```

### Build fails

```bash
# Clean rebuild
rm -rf build node_modules
yarn install
yarn build
```

### TypeScript errors

The project uses TypeScript strict mode. Common issues:

- Missing null checks: Use `?.` optional chaining
- Type assertions: Use `as Settings` when needed
- Import types: Use `import type { ... }`

### Vite HMR not working

- Check port 3000 is not in use
- Restart dev server: Ctrl+C then `yarn dev`
- Clear Vite cache: `rm -rf node_modules/.vite`

## Environment

- **Node.js**: 18+ required
- **Package Manager**: Yarn only (enforced via preinstall hook)
- **TypeScript**: ~5.9.3
- **React**: 18.2.0
- **Vite**: ^7.1.7

## External Documentation

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Phystack](https://build.phystack.com/)
- [Styled Components](https://styled-components.com/)
- [@phystack/cli](https://www.npmjs.com/package/@phystack/cli)
