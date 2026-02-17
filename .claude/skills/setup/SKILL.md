---
name: setup
description: "Interactive onboarding: understand what you're building, generate project brief with JTBD, decompose self-contained features, and customize the entire AI development infrastructure for your app."
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

If `node_modules/` doesn't exist, run `yarn install` before proceeding:
```bash
yarn install
```

## Check If Already Run

If `docs/prd/brief.md` exists, this setup has been run before. Warn the user:
> "Setup has already been run for this project. The existing brief and configuration will be overwritten. Continue?"

Use AskUserQuestion to confirm before proceeding.

## Step 1: Understand the App (Interactive Q&A)

Use AskUserQuestion for each round. Gather enough context to write a complete project brief.

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

### Round 3 — Jobs to Be Done
Frame the user's needs as JTBD statements. Ask:
- "What are the main jobs users need to accomplish with this app?"
- For each job, clarify the statement: **When** [situation], **I want to** [motivation], **so I can** [outcome]
- Probe for context: Why does this job matter? How often does it happen? What's the emotional dimension?
- Assign IDs: J-001, J-002, etc.

Aim for 3-6 job statements that cover the core value of the app.

### Round 4 — PhyStack Features
Based on the app concept, ask about relevant PhyStack capabilities:
- Does the app display products from a catalog? (Products SDK)
- What analytics events should be tracked? (session start, screen views, actions, conversions)
- Are any peripherals needed? (barcode scanner, camera, printer, payment terminal)
- Does the app need real-time updates? (Twin messaging for live content changes)
- Multi-language support needed? (settings-based localization)
- Any external API integrations? (weather, social media, custom backends)

### Round 5 — Frontend Framework

Based on the hardware targets from Round 1, present framework options using AskUserQuestion.

**Tizen-aware logic:** If the user selected Tizen as a hardware target in Round 1, Mantine is NOT compatible (requires Chrome 99+ for `:where()` and `@layer` CSS, but Tizen 4 uses Chrome 56-63). Hide the Mantine option and show a note explaining why.

**If Tizen is a target**, present 2 options:

Use AskUserQuestion with `multiSelect: false`:
- **Ant Design** (label) — Full component library (tables, forms, modals). Best for data-heavy apps. Needs Tizen compat wrapper via @ant-design/cssinjs. ~80-150kB gzip. (description)
- **Lightweight (styled-components)** (label) — No component library. Full design freedom, smallest bundle, max compatibility. ~12kB gzip. (description)

Add a note to the question: "Mantine is hidden because it requires Chrome 99+ (`:where()` CSS), which is not supported on Tizen 4 (Chrome 56-63)."

**If Tizen is NOT a target**, present 3 options:

Use AskUserQuestion with `multiSelect: false`:
- **Ant Design** (label) — Full component library (tables, forms, modals). Best for data-heavy apps. ~80-150kB gzip. (description)
- **Mantine** (label) — Modern components with CSS variable theming. Excellent DX. Chrome 99+ only. ~60-100kB gzip. (description)
- **Lightweight (styled-components)** (label) — No component library. Full design freedom, smallest bundle, max compatibility. ~12kB gzip. (description)

**If user selects "Other":** Record their choice verbatim. Note it in CLAUDE.md and agent files but skip automatic package installation for that framework — the user manages their own dependencies.

Store the framework choice for use in later steps (3b-2, 7, 8, 9, 10).

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

Incorporate relevant patterns into the brief.

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
- How to use `settings.theme.*` fields with the chosen framework from Round 5:
  - **Ant Design** → `ConfigProvider` token system, mapping `settings.theme.*` to Ant Design theme tokens
  - **Mantine** → `MantineProvider` with CSS variables, mapping `settings.theme.*` to Mantine's `createTheme()`
  - **styled-components** → `ThemeProvider` with `props.theme.*` pattern consuming settings
  - **Other** → document the user-specified framework's theming approach
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

Present design foundation for user review before proceeding to brief.

## Step 4: Generate Project Brief

Create `docs/prd/brief.md` following the format guide in `docs/prd/README.md`.

The brief must include frontmatter and these sections:
1. **Frontmatter**: `status: active`, `created: YYYY-MM-DD`, `type: project-brief`
2. **Overview**: App name, description, users, hardware, interaction model, primary goal
3. **Jobs to Be Done**: All JTBD statements from Step 1 Round 3, with IDs (J-001, J-002, etc.)
4. **Screen Inventory**: All screens with descriptions, mapped to jobs they serve
5. **Settings Schema Design**: Complete settings plan grouped by category with types and annotations
6. **Technical Context**: PhyStack Integration, Hardware & Environment, Compatibility constraints
7. **Feature Decomposition**: Numbered feature list with jobs mapping, priorities, dependencies, and sizes

The brief is organized around **jobs, not screens**. Jobs are the primary anchors; screens and features trace back to them.

Present the brief to the user for approval using AskUserQuestion:
> "Here's the project brief I've generated. Review it and let me know if anything needs to change."

If the user requests changes, update the brief and re-present.

## Step 5: Decompose into Features

Create numbered feature specs in `docs/features/` following the template in `docs/features/_template.md`.

Each feature gets its own file: `NNN-feature-name.md`

Recommended ordering:
1. `001-base-layout` — App shell, navigation, screen routing
2. `002-settings-schema` — Full schema implementation
3. `003-idle-attract` — Idle/attract screen and session start
4. Subsequent features in dependency order

### Self-Contained Feature Requirements

Each feature spec MUST be self-contained. This means:
- **Embed relevant context directly** — do not write "see brief Section X" or "see J-001 in brief"
- **Include actual JTBD statements** in the `## Jobs Addressed` section (copy the full When/I want to/So I can)
- **Include relevant schema fields** that the feature will consume or create
- **Include relevant constraints** (hardware, compatibility, accessibility level)
- **Include relevant PhyStack integrations** the feature needs
- **Include relevant design references** (link to wireframes, design system sections)
- **Test**: Could an agent implement this feature from just this spec + CLAUDE.md + rules? If not, add more context.

Each spec should also include:
- Functional requirements with IDs (FR-001, FR-002) and MUST/SHOULD language
- Given/When/Then acceptance criteria
- Schema changes needed
- Test plan
- Agent assignment (which agent handles what)
- Dependencies on other features

### Finalize Brief Lifecycle

After ALL features are created:
1. Update the brief frontmatter: `status: decomposed`
2. Add `decomposed: YYYY-MM-DD` date to frontmatter
3. The brief is now a historical document — features are the living specs

## Step 6: Generate Architecture Documents

Create these files in `docs/architecture/`:

### screen-flow.md
Mermaid state diagram from the brief's screen flow. Include:
- All screens as states
- User-triggered transitions (touch, scan, swipe)
- Timeout-based transitions (idle timeout, session timeout)
- Session lifecycle annotations

### settings-schema-design.md
Expand the brief's schema design into a complete implementation plan:
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

Rewrite the agent files in `.claude/agents/` with app-specific context.

All agents get a standard "Load Context" pattern in their First Steps:

```markdown
## First Steps
1. Read CLAUDE.md for project overview and conventions
2. Read the feature spec you're working on — this is your contract
3. Read relevant .claude/rules/ files
4. Read architecture/design docs referenced in the feature's Context section
5. Fetch PhyStack SDK docs (https://build.phystack.com/llms-full.txt) if the feature uses PhyStack integrations
```

Then add app-specific context to each agent:

### ui-developer.md
Add to the generic agent:
- `[APP_NAME]` and `[APP_DESCRIPTION]` from brief
- `[SCREEN_LIST]` — list of all screens from brief
- `[INTERACTION_RESPONSIBILITIES]` — based on interaction model (touch, passive, scanner, etc.)
- `[STYLING_LIBRARY]` — the framework chosen in Round 5. Include framework-specific guidance:
  - **Ant Design** → document `ConfigProvider` usage, component imports from `antd`, Tizen `StyleProvider` wrapper if applicable
  - **Mantine** → document `MantineProvider`, PostCSS setup, `createTheme()` customization
  - **styled-components** → document `ThemeProvider`, `props.theme.*` pattern for consuming settings
  - **Other** → note user-specified framework, reference CLAUDE.md for details
- `[APP_SPECIFIC_PATTERNS]` — domain patterns (session lifecycle, media handling, payment flow, etc.)
- Conditional sections for: camera cleanup, payment handling, product SDK usage

### schema-developer.md
Add to the generic agent:
- Settings groups table from the schema design doc
- App-specific types (product refs, media refs, domain types)
- Analytics events summary from signals plan

### reviewer.md
Add to the generic agent:
- App-specific architecture checks based on brief
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

**PRESERVE these sections in every agent — do NOT remove or replace them:**
- The **"Fetch PhyStack SDK docs"** step in First Steps (step 5 or 6 depending on agent) — this is the conditional SDK doc fetch with `WebFetch` to `https://build.phystack.com/llms-full.txt`. You may refine the prompt examples to be more app-specific, but keep the URL, the `WebFetch` pattern, and the conditional trigger.
- The **"PhyStack SDK Reference"** section at the bottom of each agent — this lists when to fetch SDK docs. You may add app-specific fetch triggers but do not remove the existing ones.

## Step 8: Generate App-Specific Rules

Write `.claude/rules/app-specific.md` with:
- Domain-specific patterns (e.g., "restaurant menus must show allergens")
- App-specific constraints from the brief
- Technology choices made during setup, including the frontend framework from Round 5
- The chosen framework's import patterns and component conventions
- Integration patterns for selected PhyStack features

## Step 9: Update Project Files

### CLAUDE.md
Edit to add:
- App name and description in the Project Overview
- Key jobs the app serves
- Reference to docs/ structure
- Key architecture decisions from brief, including the chosen frontend framework from Round 5
- App-specific commands or workflows
- Ensure references use `docs/prd/brief.md` (not the old `PRD.md` name)

### README.md
Edit to add:
- App name, description, and purpose
- Feature list from brief (marked for future updates by /feature)
- Updated project structure reflecting new directories
- Hardware requirements from brief

### DESCRIPTION.md
Update marketplace description with app-specific content.

### package.json
Update `name` field to match the app name (kebab-case).

## Step 10: Scaffold Source Structure

Based on the brief, create initial source directories and files:

```bash
# Create directories for screens/components
mkdir -p src/components
mkdir -p src/hooks
mkdir -p src/types
```

### Framework-Specific Setup

Based on the framework chosen in Round 5:

**Ant Design:**
```bash
yarn add antd @ant-design/icons dayjs
```
- Note `ConfigProvider` wrapper approach in App.tsx scaffold notes
- If Tizen is a hardware target: note that `StyleProvider` with `legacyLogicalPropertiesTransformer` from `@ant-design/cssinjs` is required for compatibility

**Mantine:**
```bash
yarn add @mantine/core @mantine/hooks postcss postcss-preset-mantine postcss-simple-vars
```
- Note PostCSS config needed in `vite.config.ts`
- Remove `styled-components` and `@types/styled-components` if present:
```bash
yarn remove styled-components @types/styled-components
```

**Lightweight (styled-components):**
- No packages to add or remove (already installed in the template)

**Other (user-specified):**
- Record the framework name in CLAUDE.md and agent files
- Skip automatic package installation — the user manages their own dependencies
- Note in CLAUDE.md that the framework was user-specified and deps are manually managed

### General Scaffolding

Create placeholder files as needed:
- `src/types/index.ts` — App-specific type definitions
- Initial component files for the first feature if clear from brief

Do NOT implement full features — just create the structure that feature development will fill in.

## Step 10a: Install Dependencies

Run `yarn install` to install all dependencies including any framework packages added in Step 10.

```bash
yarn install
```

If installation fails, present the error to the user and ask how to proceed.

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

### Jobs to Be Done:
- J-001: [job title] — [brief description]
- J-002: [job title] — [brief description]
...

### Features ([count] planned):
1. 001-base-layout — [description]
2. 002-settings-schema — [description]
...

### Generated:
- Project Brief: docs/prd/brief.md (now decomposed — features are the living specs)
- Feature specs: docs/features/001-*.md through NNN-*.md (self-contained, ready for /feature)
- Architecture: docs/architecture/ (screen flow, schema design, signals)
- Design: docs/design/ (brand guidelines, personas, design system, wireframes, interaction flows, accessibility)
- Schema theme fields: src/schema.ts theme section with brand-aligned @default values
- Customized agents and rules

### Next Steps:
Run `/feature 001-base-layout` to start building!
```
