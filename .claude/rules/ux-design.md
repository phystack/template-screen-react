# UX Design Rules

## Design-First Principle
- Design specs must be approved before tests are written
- Every feature with UI changes needs a Design Spec section in its feature doc
- The ux-designer agent creates the spec; the ui-developer implements to spec
- For features with no UI changes, the design spec can be skipped with a note in the feature doc

## Theme Source of Truth
- `src/schema.ts` theme fields are the single source of truth for visual identity
- NEVER hardcode colors, fonts, or spacing values — always reference `settings.theme.*`
- Theme field names must align with the TenantSettings structure from the platform
- `docs/design/design-system.md` documents usage patterns but NEVER duplicates theme values
- When reading theme values, follow the settings priority: `index.json` → `.generated.json` → schema `@default`s

## Wireframe Conventions
- Use ASCII art for all wireframes (no image tools available)
- Annotate every colored element with its `settings.theme.*` reference
- Annotate every content element with its `settings.*` reference
- Mark touch target sizes on all interactive elements (minimum 44x44px)
- Show all states: default, active/pressed, loading, error, empty
- Include responsive notes for different orientations where applicable

## Design System Enforcement
- Use schema theme fields for all visual styling in components
- Do not introduce ad-hoc color values, spacing, or border-radius
- New design tokens must be added to `src/schema.ts` theme section first
- Components should consume `settings.theme.*` values, not literal CSS values (check CLAUDE.md for the chosen styling framework)
- If a new token is needed, add it to the schema with a TenantSettings-aligned name

## Interaction Design Requirements
- Define all states for every interactive element: default, hover/focus, pressed, disabled, loading, error
- Specify error states with user-friendly messages (not technical errors)
- Specify empty states (what shows when there's no data)
- Specify loading states (skeleton, spinner, or progressive)
- Document the interaction sequence as numbered user steps

## Accessibility Minimums
- Target WCAG 2.1 AA (adjust level based on PRD requirements)
- All interactive elements must have ARIA roles and labels
- Color contrast ratio: 4.5:1 for normal text, 3:1 for large text
- Focus must be visible and follow a logical order
- Touch targets: minimum 44x44px with adequate spacing
- Don't rely on color alone to convey information

## Session UX Rules
- Idle/attract screen must be visually engaging to draw users in
- Timeout warnings must be visible and give adequate time to respond
- Session end must cleanly reset all visible state
- No residual data from previous sessions should be visible
- Transition between session states should be smooth and intentional

## Settings-Driven Design
- Every user-facing content element must map to a settings field
- Wireframes must show the settings path for each content element
- No hardcoded text, images, or content in the design
- Design for the case where settings values are empty or default
