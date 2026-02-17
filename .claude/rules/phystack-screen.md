# PhyStack Screen App Rules

## Settings-Driven Content
- ALL user-facing text, images, colors, and content MUST come from settings (`src/schema.ts`)
- NEVER hardcode content that should be configurable
- Every setting needs JSDoc annotations: `@title`, `@description`, `@default`
- Use appropriate widget hints: `@ui textarea`, `@widget color`, `@widget image`, `@widget product`, `@format uri`
- Group related settings with nested interfaces

## Schema Conventions
- Schema file: `src/schema.ts`, exports `Settings` type
- Run `yarn schema` after any schema change to validate
- Use `json-schema-defaults` compatible `@default` values
- Product references: `{ $ref: "ombori/product" }` with `@widget product`
- Image references: `{ $ref: "ombori/image" }` with `@widget image`
- Audio references: `{ $ref: "ombori/audio" }` with `@widget audio`

## Build System
- `yarn build` runs: schema -> tsc -> vite build -> post-build
- `yarn schema` generates `build/schema.json` and `build/meta-schema.json`
- Post-build copies schemas to `_schema.json` / `_meta-schema.json` (omg-deploys format)
- Asset manifest generated automatically for deployment

## Hub Client & Signals
- Import `connectPhyClient` from `@phystack/hub-client`
- Use typed settings with the `Settings` interface
- Emit signals for analytics: `signals.sendEvent(name, data)`
- Always clean up hub client connection on unmount

## Session Management
- Screen apps must handle idle/active/complete lifecycle
- Implement idle timeout -> return to attract/idle screen
- Clean up resources between sessions (timers, media, state)
- Never leak state from one session to the next

## Device Considerations
- Touch targets minimum 44x44px for kiosks
- Consider screen orientation and resolution
- Handle network connectivity loss gracefully
- Always-on: prevent memory leaks (see stability-audit skill)

## PhyStack Documentation
- Full SDK docs: https://build.phystack.com/llms-full.txt
- Use WebFetch to retrieve docs on-demand when needed
