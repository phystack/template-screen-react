# Setup Guide

## Prerequisites

- Node.js 18+
- Yarn (enforced via preinstall hook)
- Claude Code CLI

## Getting Started

### 2. Run AI-Assisted Setup

In Claude Code, run:

```
/setup
```

This interactive onboarding will:

1. Ask what you're building (app concept, hardware, interaction model)
2. Fetch relevant PhyStack SDK documentation
3. Set design direction (brand research, theme, visual style → writes theme fields to `src/schema.ts`)
4. Generate UX design foundation (personas, design system, wireframes, interaction flows, accessibility)
5. Generate a Product Requirements Document (`docs/prd/PRD.md`)
6. Decompose into numbered feature specs (`docs/features/NNN-*.md`)
7. Generate architecture docs (screen flow, schema design, signals plan)
8. Customize AI agents with your app's context
9. Generate app-specific rules and guardrails
10. Update project metadata (CLAUDE.md, README.md, package.json)
11. Scaffold initial source structure
12. Verify everything builds and tests pass

### 3. Build Features

After setup, build features one at a time:

```
/feature 001-base-layout
```

Each feature follows a design-first TDD workflow:

- Design spec (wireframes, component breakdown, interaction sequence)
- Schema changes
- Write failing tests (Red)
- Implement to pass tests (Green)
- Refactor
- Stability audit (for features with runtime resources)
- Reflect & evolve (updates docs, agents, rules)
- Create PR

### 4. Capture Learnings

When the AI does something wrong, correct it and capture the rule:

```
/learn Don't use optional chaining — it's not supported on Tizen 4
```

## Manual Setup (Without AI)

If you prefer to work without the AI workflow:

```bash
yarn install      # Install dependencies
yarn dev          # Start dev server on http://localhost:3000
yarn test         # Run tests
yarn build        # Production build
```

Edit `src/schema.ts` for settings, `src/App.tsx` for the main component.

## Reference

- `CLAUDE.md` — Full development guidance
- `docs/` — PRD, feature specs, architecture, design docs (after /setup)
- `.claude/agents/` — AI agent definitions
- `.claude/skills/` — Available skills
- `.claude/rules/` — Development rules and guardrails
