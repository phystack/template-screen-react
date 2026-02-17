# Tizen 4 / ES2015 Compatibility Rules

## Build Targets
- Vite: `target: 'es2015'`
- TypeScript: `target: "ES2015"`, `lib: ["ES2015", "DOM", "DOM.Iterable"]`
- Tizen 4 uses Chromium ~56-63 (circa 2017)

## Forbidden Syntax
These are NOT supported on Tizen 4 and must NOT be used in source code:

| Forbidden | Use Instead |
|-----------|------------|
| `foo?.bar` (optional chaining) | `foo && foo.bar` or explicit null checks |
| `foo ?? bar` (nullish coalescing) | `foo !== null && foo !== undefined ? foo : bar` |
| `BigInt` / `123n` | Regular numbers or string math |
| Top-level `await` | Wrap in async IIFE or use `.then()` |
| `Array.prototype.at()` | `arr[arr.length - 1]` for last element |
| `Object.hasOwn()` | `Object.prototype.hasOwnProperty.call(obj, key)` |
| `String.prototype.replaceAll()` | `str.split(x).join(y)` or regex with `/g` flag |
| `structuredClone()` | `JSON.parse(JSON.stringify(obj))` for deep clone |
| `globalThis` | `window` in browser context |

## Allowed ES2015+ Features (Polyfilled by Vite)
- Arrow functions, classes, template literals, let/const
- Promises, async/await
- Map, Set, WeakMap, WeakSet
- Symbol
- Destructuring, spread/rest operators
- for...of loops
- Default parameters

## Dependency Rules
- When adding dependencies, verify ES2015 compatibility
- Check if the library provides an ES5/ES2015 bundle
- Test on actual Tizen device or Chrome 56 equivalent if possible

## Common Pitfalls
- Some libraries use optional chaining internally — check bundle output
- CSS custom properties (variables) are supported on Tizen 4
- Flexbox is supported but some advanced features may not be
- `IntersectionObserver` needs polyfill on oldest Tizen 4 builds
- Video autoplay requires `muted` attribute on Tizen

## Testing Compatibility
After building, inspect the output JS for forbidden syntax:
```bash
# Quick check for optional chaining in build output
grep -r '?\.' build/static/js/ | grep -v '?\.0' | head -20
```
