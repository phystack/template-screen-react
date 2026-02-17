---
name: setup
description: "Interactive onboarding: understand what you're building, generate PRD, decompose features, and customize the entire AI development infrastructure for your app."
user-invocable: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, WebFetch, WebSearch, AskUserQuestion, Task
---

# Setup: AI-Native Project Onboarding

Transform this generic PhyStack screen template into a fully-configured, app-specific project with customized agents, rules, documentation, and scaffolding.

## Prerequisites Check

Before starting, verify:
```bash
node --version    # Must be 18+
yarn --version    # Must be installed
```

If `node_modules/` doesn't exist, run `yarn install`.

## Check If Already Run

If `docs/prd/PRD.md` exists, this setup has been run before. Warn the user:
> "Setup has already been run for this project. The existing PRD and configuration will be overwritten. Continue?"

Use AskUserQuestion to confirm before proceeding.

## Step 1: Understand the App (Interactive Q&A)

Use AskUserQuestion for each round. Gather enough context to write a complete PRD.

### Round 1 — Core Concept
Ask the user:
- What are you building? (brief description)
- Who are the target users? (customers, employees, visitors, etc.)
- What hardware will this run on? (Jetson, NUC, Tizen, Raspberry Pi, browser, etc.)
- What's the primary goal? (sell products, inform, entertain, guide, check-in, etc.)

### Round 2 — Interaction Model
Based on Round 1 answers, ask about:
- Interaction type: touch-only, passive (no touch), scanner-based, camera-based, or mixed?
- How many screens/views does the app need? List them briefly.
- Session lifecycle: How does a session start? (touch to wake, scan QR, motion detect, always active?)
- Idle behavior: What happens after inactivity? (screensaver, attract loop, reset?)
- Expected session duration? (seconds for quick interactions, minutes for browsing)

### Round 3 — PhyStack Features
Based on the app concept, ask about relevant PhyStack capabilities:
- Does the app display products from a catalog? (Products SDK)
- What analytics events should be tracked? (session start, screen views, actions, conversions)
- Are any peripherals needed? (barcode scanner, camera, printer, payment terminal)
- Does the app need real-time updates? (Twin messaging for live content changes)
- Multi-language support needed? (settings-based localization)
- Any external API integrations? (weather, social media, custom backends)

## Step 2: Fetch PhyStack Documentation

Use WebFetch to retrieve PhyStack SDK documentation:
```
WebFetch: https://build.phystack.com/llms-full.txt
Prompt: "Extract sections relevant to: [list of PhyStack features identified in Q&A]. Include API signatures, configuration patterns, and usage examples."
```

Map user needs to specific PhyStack SDK capabilities. Note which imports, hooks, and APIs the app will need.

## Step 3: Optional Domain Research

If the app has a specific domain (e.g., restaurant ordering, museum guide, retail checkout), use WebSearch to find UX best practices:
```
WebSearch: "[domain] [hardware type] UX best practices"
```

Incorporate relevant patterns into the PRD.

## Step 3a: Design Direction

Ask simple design steering questions using AskUserQuestion:

### Brand Identity
Ask: "What brand is this for?"
- **Brand name provided** → Use WebSearch to research the brand's colors, typography, and visual style → present findings for user confirmation
- **Style description** (e.g., "modern and clean") → translate to concrete color/style choices
- **No specific brand** → use neutral PhyStack defaults (`#1976d2` primary, `#ff9800` secondary, white background)

### Theme Direction
Ask: "Light or dark theme?"
- Light → white/light backgrounds (`#ffffff` bg, `#f5f5f5` surface), dark text
- Dark → dark backgrounds (`#121212` bg, `#1e1e1e` surface), light text

### Visual Style
Ask: "Visual style?" — offer choices:
- Minimal, Bold, Playful, Corporate, Rounded, Sharp

Map visual style to `borderRadius`: sharp=2, corporate=4, minimal=8, rounded=12, playful=16, pill=24.

### Primary Color
Ask: "Primary color?" — accept hex value, color name (convert to hex), or "use brand default" (from research).

### Write Schema Theme Fields
Add `theme` fields to `src/schema.ts` based on answers:
```typescript
theme: {
  /** @title Primary Color @default "#1976d2" @widget color */
  primaryColor: string;
  /** @title Secondary Color @default "#ff9800" @widget color */
  secondaryColor: string;
  /** @title Background Color @default "#ffffff" @widget color */
  backgroundColor: string;
  /** @title Surface Color @default "#f5f5f5" @widget color */
  surfaceColor: string;
  /** @title Border Radius @default 8 */
  borderRadius: number;
}
```

Replace `@default` values with the user's choices. Field names align to TenantSettings structure so org-level branding from the console maps directly.

**Fonts are NOT set during setup** — users upload custom fonts via Console > Organisation > Branding. Schema defaults to system fonts.

### Brand Guidelines (Optional)
If brand research yielded non-visual info (voice, tone, copy style, imagery direction), generate `docs/design/brand-guidelines.md`.

Present schema changes for approval before proceeding.

## Step 3b: UX Design Foundation

Using the schema theme fields from Step 3a as input, generate 5 design documents:

### 3b-1: User Personas
Research target users from the app concept and create `docs/design/personas.md` with:
- 2-3 personas (name, role, goals, context of use, technical comfort)
- How each persona interacts with the app on the target hardware

### 3b-2: Design System Usage Guide
Create `docs/design/design-system.md` documenting:
- How to use `settings.theme.*` fields in styled-components
- Spacing conventions
- Responsive breakpoints for target hardware
- Component patterns (cards, buttons, headers)
- References `src/schema.ts` as source of truth — does NOT duplicate values

### 3b-3: Screen Wireframes
Create `docs/design/wireframes.md` with ASCII art wireframes for each screen from the app concept:
- Annotated with `settings.theme.*` references for colors/spacing
- Annotated with `settings.*` references for content
- Touch target sizes marked on interactive elements
- Responsive notes where applicable

### 3b-4: Interaction Flows
Create `docs/design/interaction-flows.md` with Mermaid diagrams showing:
- User journeys through the app (user perspective, not system state)
- Session lifecycle (idle → active → complete → idle)
- Error recovery paths

### 3b-5: Accessibility Requirements
Create `docs/design/accessibility.md` with:
- Target WCAG level (based on app context and audience)
- ARIA patterns for each component type
- Color contrast requirements
- Focus management strategy
- Touch target minimums

Present design foundation for user review before proceeding to PRD.

## Step 4: Generate PRD

Create `docs/prd/PRD.md` following the format guide in `docs/prd/README.md`.

The PRD must include:
1. **Overview**: App name, description, users, hardware, interaction model
2. **Screen Inventory**: All screens with descriptions and purposes
3. **Screen Flow**: Mermaid state diagram showing all transitions
4. **Settings Schema Design**: Complete settings plan grouped by category with types and annotations
5. **PhyStack Integration**: Hub Client usage, Products SDK, signals, modules
6. **Hardware & Environment**: Target devices, peripherals, constraints
7. **UX Design**: Design system reference (`docs/design/design-system.md`), personas summary, wireframe references (`docs/design/wireframes.md`), interaction model rationale, accessibility target (WCAG level)
8. **Branding**: Schema theme fields summary (from Step 3a), TenantSettings alignment notes, brand guidelines reference (if generated)
9. **Constraints**: ES2015/Tizen compat, accessibility, i18n, privacy
10. **Feature Decomposition**: Numbered feature list with priorities and dependencies

Present the PRD to the user for approval using AskUserQuestion:
> "Here's the PRD I've generated. Review it and let me know if anything needs to change."

If the user requests changes, update the PRD and re-present.

## Step 5: Decompose into Features

Create numbered feature specs in `docs/features/` following the template in `docs/features/_template.md`.

Each feature gets its own file: `NNN-feature-name.md`

Recommended ordering:
1. `001-base-layout` — App shell, navigation, screen routing
2. `002-settings-schema` — Full schema implementation
3. `003-idle-attract` — Idle/attract screen and session start
4. Subsequent features in dependency order

Each spec should include:
- Clear acceptance criteria
- Schema changes needed
- Test plan
- Agent assignment (which agent handles what)
- Dependencies on other features

## Step 6: Generate Architecture Documents

Create these files in `docs/architecture/`:

### screen-flow.md
Mermaid state diagram from the PRD's screen flow. Include:
- All screens as states
- User-triggered transitions (touch, scan, swipe)
- Timeout-based transitions (idle timeout, session timeout)
- Session lifecycle annotations

### settings-schema-design.md
Expand the PRD's schema design into a complete implementation plan:
- Every settings group with its interface name
- Every field with TypeScript type, JSDoc annotations, default value
- Widget hints and validation rules
- Grouping strategy and nesting structure

### signals-plan.md
Analytics events plan:
- Event name, when it fires, data payload
- Dashboard card configuration for analytics-schema.ts
- Conversion funnel events if applicable

## Step 7: Customize Agents

Rewrite the agent files in `.claude/agents/` with app-specific context:

### ui-developer.md
Add to the generic agent:
- `[APP_NAME]` and `[APP_DESCRIPTION]` from PRD
- `[SCREEN_LIST]` — list of all screens from PRD
- `[INTERACTION_RESPONSIBILITIES]` — based on interaction model (touch, passive, scanner, etc.)
- `[STYLING_LIBRARY]` — styled-components by default, or recommended alternative
- `[APP_SPECIFIC_PATTERNS]` — domain patterns (session lifecycle, media handling, payment flow, etc.)
- Conditional sections for: camera cleanup, payment handling, product SDK usage

### schema-developer.md
Add to the generic agent:
- Settings groups table from the schema design doc
- App-specific types (product refs, media refs, domain types)
- Analytics events summary from signals plan

### reviewer.md
Add to the generic agent:
- App-specific architecture checks based on PRD
- Device-specific UX checks based on target hardware
- Privacy checks based on data handling
- Domain-specific rules

### ux-designer.md
Add to the generic agent:
- `[BRAND_CONTEXT]` — Brand name, colors, visual style from Step 3a
- `[HARDWARE_CONTEXT]` — Target device and viewing distance
- `[INTERACTION_MODEL]` — Touch, passive, scanner, etc. and implications for UX
- `[DOMAIN_UX_PATTERNS]` — Domain-specific UX patterns from research (e.g., restaurant ordering conventions)
- `[ACCESSIBILITY_LEVEL]` — WCAG target level and any domain-specific accessibility needs

When rewriting agents, READ the existing generic agent content first, then EDIT to add app-specific sections. Keep the generic structure and add app context.

## Step 8: Generate App-Specific Rules

Write `.claude/rules/app-specific.md` with:
- Domain-specific patterns (e.g., "restaurant menus must show allergens")
- App-specific constraints from the PRD
- Technology choices made during setup
- Integration patterns for selected PhyStack features

## Step 9: Update Project Files

### CLAUDE.md
Edit to add:
- App name and description at the top
- Reference to docs/ structure
- Key architecture decisions from PRD
- App-specific commands or workflows

### README.md
Edit to add:
- App name, description, and purpose
- Feature list from PRD (marked for future updates by /feature)
- Updated project structure reflecting new directories
- Hardware requirements from PRD

### DESCRIPTION.md
Update marketplace description with app-specific content.

### package.json
Update `name` field to match the app name (kebab-case).

## Step 10: Scaffold Source Structure

Based on the PRD, create initial source directories and files:

```bash
# Create directories for screens/components
mkdir -p src/components
mkdir -p src/hooks
mkdir -p src/types
```

Create placeholder files as needed:
- `src/types/index.ts` — App-specific type definitions
- Initial component files for the first feature if clear from PRD

Do NOT implement full features — just create the structure that feature development will fill in.

## Step 11: Verify

Run verification commands:
```bash
yarn schema        # Schema generates without errors
yarn lint          # No lint errors
yarn test          # Tests pass (smoke test)
yarn build         # Production build succeeds
```

Fix any issues before completing.

## Step 12: Present Summary

Output a summary to the user:

```
## Setup Complete!

**App**: [name] — [one-line description]
**Target**: [hardware] with [interaction model]

### Features ([count] planned):
1. 001-base-layout — [description]
2. 002-settings-schema — [description]
...

### Generated:
- PRD: docs/prd/PRD.md
- Feature specs: docs/features/001-*.md through NNN-*.md
- Architecture: docs/architecture/ (screen flow, schema design, signals)
- Design: docs/design/ (brand guidelines, personas, design system, wireframes, interaction flows, accessibility)
- Schema theme fields: src/schema.ts theme section with brand-aligned @default values
- Customized agents and rules

### Next Steps:
Run `/feature 001-base-layout` to start building!
```
