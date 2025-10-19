# Phystack React App Template

Modern Vite-based React TypeScript template for building Phystack Grid Apps.

## Features

- ⚡️ **Vite** - Lightning-fast build tool with instant HMR
- ⚛️ **React 18** - Modern React with concurrent features
- 🎨 **Styled Components** - CSS-in-JS styling with TypeScript support
- 📦 **Hub Client** - Seamless integration with Phystack Grid infrastructure
- 🔧 **TypeScript** - Full type safety and IntelliSense
- 📊 **Analytics** - Built-in analytics schema support
- 🎯 **Smart Settings** - Priority-based settings system (downloaded vs schema defaults)
- ✨ **Modern React Patterns** - Hooks, cleanup, error boundaries

## Quick Start

### Prerequisites

- Node.js 18+ or Bun
- Yarn (enforced via preinstall hook)
- [@phystack/cli](https://www.npmjs.com/package/@phystack/cli) for deployment

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

The dev server automatically:
1. Generates settings from schema defaults (ephemeral)
2. Starts Vite dev server with HMR on http://localhost:3000
3. Watches for schema changes and regenerates settings

## Settings Workflow

The template uses a **priority-based settings system**:

### Priority Order
1. **`src/settings/index.json`** - Downloaded from installation (persistent, gitignored)
2. **`src/settings/.generated.json`** - Generated from schema (ephemeral, auto-created)

### Development Workflows

**Using schema defaults (ephemeral):**
```bash
yarn dev
# ✅ Auto-generates .generated.json from src/schema.ts
# ✅ Always fresh - regenerated on every dev run
# ✅ Perfect for local development
```

**Using real installation data (persistent):**
```bash
yarn download-settings <installation-name>
# ✅ Downloads to src/settings/index.json
# ✅ Takes priority over .generated.json
# ✅ Persists across dev runs

yarn dev
# ✅ Uses downloaded settings
# ✅ Still regenerates .generated.json (as fallback)
```

**Switch back to schema defaults:**
```bash
rm src/settings/index.json
yarn dev
# ✅ Falls back to .generated.json
```

## Project Structure

```
├── public/              # Static assets
├── src/
│   ├── App.tsx         # Main React component
│   ├── main.tsx        # App entry point (React 18 createRoot)
│   ├── schema.ts       # Settings TypeScript schema (source of truth)
│   ├── analytics-schema.ts  # Analytics configuration
│   ├── phystack-logo.svg    # App logo
│   └── utils/
│       └── dev-mode.ts     # Settings loader with priority system
├── scripts/
│   ├── init-settings.js           # Settings initialization
│   ├── build-schema.js            # Schema generation
│   ├── build-analytics-schema.js  # Analytics schema generation
│   └── post-build.js              # Asset manifest + build processing
├── meta/                # App screenshots for marketplace
├── DESCRIPTION.md       # App description for marketplace
└── vite.config.ts       # Vite config with polyfills
```

## Available Scripts

### Development
- `yarn dev` / `yarn start` - Start dev server with auto-settings initialization
- `yarn preview` - Preview production build locally

### Building
- `yarn build` - Production build with schema generation
- `yarn schema` - Generate settings and analytics schemas

### Settings Management
- `yarn download-settings <name>` - Download settings from installation

### Deployment
- `yarn pub` - Publish app to Phystack Grid
- `yarn upload-description` - Upload DESCRIPTION.md
- `yarn connect` - Connect to dev WebSocket

### Code Quality
- `yarn lint` - Run ESLint

## Configuration

### Settings Schema

Edit `src/schema.ts` to define your app settings:

```typescript
/**
 * @title My App Settings
 */
export type Settings = {
  /**
   * @title Product Name
   * @default "My Product"
   */
  productName: string;

  /**
   * @title Product Price
   * @default "99 USD"
   */
  productPrice: string;
}

export default Settings;
```

The `@default` annotations are used to generate `src/settings/.generated.json`.

### Analytics

Edit `src/analytics-schema.ts` to customize analytics dashboards:

```typescript
import { AnalyticsSchema, CardType, SessionInteractionType } from '@ombori/grid-reports';

const analyticsSchema: AnalyticsSchema = {
  groups: [
    {
      name: 'Overview',
      cards: [
        { type: CardType.Sessions, interactionType: SessionInteractionType.Interactive },
      ],
    },
  ],
};

export default analyticsSchema;
```

### Environment Variables

- `PUBLIC_URL` - Base path for deployment (CRA compatibility)
- `VITE_ROOT_PATH` - Alternative base path (Vite-specific)
- `DEV` - Development mode flag (auto-set by Vite)

### Custom Base Path

```bash
# For deployment to subdirectory
PUBLIC_URL=/my-app yarn build

# Or using Vite-specific variable
VITE_ROOT_PATH=/my-app yarn build
```

## Build Output

The build process generates:

```
build/
├── static/
│   ├── js/           # JavaScript bundles
│   ├── css/          # CSS files
│   └── svg/          # SVG assets
├── index.html
├── asset-manifest.json    # Deployment manifest (omg-deploys compatible)
├── _schema.json          # Settings schema
├── _meta-schema.json     # Analytics schema
└── package.json          # Package metadata
```

## Compatibility

✅ Compatible with:
- omg-deploys Azure Functions
- @phystack/cli deployment tools
- screen-boot deployment system
- CRA environment variables
- React 18+ concurrent features

## Modern React Patterns

This template follows React 18 best practices:

- ✅ Uses `createRoot()` API (not deprecated `ReactDOM.render()`)
- ✅ Proper cleanup in useEffect with cancellation flags
- ✅ Error boundaries and error state handling
- ✅ No unnecessary `useCallback`/`useMemo` (kept simple)
- ✅ Type-safe with TypeScript strict mode
- ✅ Modern imports (no `import React`)

## Deployment

### Publishing to Phystack Grid

```bash
# Build the app
yarn build

# Publish to grid
yarn pub

# Upload description and screenshots
yarn upload-description
```

### Setting Up in Console

1. Go to Phystack Console
2. Create installation
3. Add your app
4. Configure settings via UI or upload custom settings

### Downloading Settings for Development

```bash
# Download from specific installation
yarn download-settings <installation-name>

# Now dev mode uses real installation data
yarn dev
```

## Troubleshooting

### Settings not loading

```bash
# Check if settings exist
ls -la src/settings/

# Regenerate from schema
rm -rf src/settings/
yarn dev
```

### Build fails

```bash
# Clean and rebuild
rm -rf build node_modules
yarn install
yarn build
```

### Hub client connection fails in dev

Make sure you're using schema-generated settings:
```bash
rm src/settings/index.json  # Remove downloaded settings
yarn dev                     # Use schema defaults
```

## Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Phystack Documentation](https://build.phystack.com/)
- [Styled Components](https://styled-components.com/)
- [@phystack/cli](https://www.npmjs.com/package/@phystack/cli)

## License

Private - for Phystack Grid Apps only
