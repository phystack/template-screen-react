# Setup Guide

## Prerequisites

- Node.js 18+
- Yarn (enforced via preinstall hook)
- Claude Code CLI

## Getting Started

### 1. Install Dependencies

```bash
yarn install
```

### 2. Run AI-Assisted Setup

In Claude Code, run:

```
/setup
```

This interactive onboarding will:
1. Ask what you're building (app concept, hardware, interaction model)
2. Fetch relevant PhyStack SDK documentation
3. Generate a Product Requirements Document (`docs/prd/PRD.md`)
4. Decompose into numbered feature specs (`docs/features/NNN-*.md`)
5. Generate architecture docs (screen flow, schema design, signals plan)
6. Customize AI agents with your app's context
7. Generate app-specific rules and guardrails
8. Update project metadata (CLAUDE.md, README.md, package.json)
9. Scaffold initial source structure
10. Verify everything builds and tests pass

### 3. Build Features

After setup, build features one at a time:

```
/feature 001-base-layout
```

Each feature follows a TDD workflow:
- Schema changes first
- Write failing tests (Red)
- Implement to pass tests (Green)
- Refactor
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
- `docs/` — PRD, feature specs, architecture docs (after /setup)
- `.claude/agents/` — AI agent definitions
- `.claude/skills/` — Available skills
- `.claude/rules/` — Development rules and guardrails
