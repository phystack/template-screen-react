---
name: feature
description: "TDD feature workflow: branch -> schema -> tests (Red) -> implement (Green) -> refactor -> review -> reflect & evolve -> PR."
user-invocable: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, WebFetch, WebSearch, Task, AskUserQuestion, TaskCreate, TaskUpdate, TaskList
---

# Feature: TDD Development Workflow

Implement a feature using Test-Driven Development with built-in reflection and continuous improvement.

## Usage

```
/feature NNN-feature-name       # Implement feature from existing spec
/feature describe a new feature  # Create spec interactively, then implement
```

## Step 0: Load Context

1. Read `CLAUDE.md` for project overview and conventions
2. Read the feature spec (`docs/features/NNN-*.md`) — this is your contract
3. Read relevant `.claude/rules/` files:
   - `app-specific.md` — domain patterns
   - `phystack-screen.md` — SDK patterns
   - `tizen-compat.md` — compatibility rules
   - `tdd.md` — testing patterns
   - `ux-design.md` — design rules
4. Read architecture/design docs referenced in the feature's Context section

Optional: For historical context on project decisions, see `docs/prd/brief.md`

## Step 1: Locate or Create Feature Spec

**If a spec exists** in `docs/features/NNN-feature-name.md`:
- Read it, confirm understanding with the user
- Update status to `in-progress`

**If no spec exists**:
- Ask the user to describe the feature using AskUserQuestion
- Create a new spec in `docs/features/` following `docs/features/_template.md`
- The spec MUST be self-contained — embed all relevant context (screens, settings, constraints, integrations)
- Include JTBD statements, functional requirements (FR-###), Given/When/Then acceptance criteria
- Flag unknowns with `[NEEDS CLARIFICATION: description]` markers
- Present to user for approval before proceeding

## Step 2: Create Feature Branch

```bash
git checkout -b feature/NNN-feature-name
```

## Step 2b: Design Spec

If this feature involves UI changes, create a Design Spec before writing tests:

1. Read `docs/design/design-system.md` for theme usage patterns
2. Read `docs/design/wireframes.md` for existing screen wireframes
3. Read `docs/design/interaction-flows.md` for current user journeys

Create a **Design Spec** section in the feature doc (`docs/features/NNN-feature-name.md`) with:
- **Wireframe**: Text-based layout for new/changed screens (annotated with `settings.theme.*` and `settings.*` references)
- **Component breakdown**: Table of components (component name, purpose, settings consumed, states)
- **Interaction sequence**: Numbered steps describing the user's journey
- **Error states**: What the user sees when things go wrong
- **Accessibility**: ARIA roles, focus management, contrast requirements

Present the Design Spec for user approval before proceeding to TDD.

**Skip condition**: For features with no UI changes (e.g., analytics-only, schema refactoring), note "No UI changes — design spec skipped" in the feature doc and proceed directly to Step 3.

## Step 3: Schema First

If the feature requires new settings:
1. Read `docs/architecture/settings-schema-design.md` for the planned schema
2. Edit `src/schema.ts` — add new settings with full JSDoc annotations
3. Run `yarn schema` to validate
4. Update test data if needed

If the feature requires new analytics events:
1. Read `docs/architecture/signals-plan.md`
2. Update `src/analytics-schema.ts`

## Step 4: Write Failing Tests (Red)

Write tests BEFORE implementation:

1. Create test file(s) for new components: `ComponentName.test.tsx`
2. Import helpers from `src/utils/test-utils`
3. Write tests for each acceptance criterion
4. Tests should describe the desired behavior, not the implementation
5. Run `yarn test` — tests should FAIL (Red phase)

Test categories to consider:
- Renders with settings (settings-driven content)
- User interactions (touch, click, navigation)
- State transitions (screen changes, session lifecycle)
- Error handling (missing data, network errors)
- Cleanup (unmount behavior, timer cleanup)

## Step 5: Implement (Green)

Write the minimum code to make all tests pass:

1. Create/edit component files
2. Wire up settings consumption
3. Implement interactions and state management
4. Follow rules in `.claude/rules/` (ES2015 compat, PhyStack patterns, TDD rules)
5. Run `yarn test` — tests should PASS (Green phase)

## Step 6: Refactor

With tests green, clean up:
- Extract shared patterns into hooks or utilities
- Improve naming and code organization
- Remove duplication
- Run `yarn test` after each refactor to ensure tests stay green

## Step 7: Verify

Run all verification:
```bash
yarn test          # All tests pass
yarn lint          # No lint errors
yarn schema        # Schema valid (if changed)
yarn build         # Production build succeeds
```

Fix any issues.

## Step 8: Reflect & Evolve

**This step is critical.** After all tests pass and verification succeeds, run through this checklist:

### 8a. Update README.md
- Add/update the feature in the Features section
- Update project structure if new directories or files were created
- Update available commands if new scripts were added
- Update settings reference if new configurable settings were added

### 8b. Update CLAUDE.md
- If new conventions were discovered (e.g., "always use X pattern for Y"), add them
- If troubleshooting steps were needed during implementation, document them
- If new commands or workflows were established, add them
- If the project has evolved significantly (new screen, changed interaction model), update the Project Overview
- Do NOT update the project brief — it's a historical document

### 8c. Update Agent Instructions
If during implementation you found that agent instructions were lacking:
- "I needed to know about X but my instructions didn't mention it"
- "The review checklist should include Y for this type of feature"
- Edit the relevant `.claude/agents/*.md` file to add the missing context

### 8d. Capture Patterns in Rules
If a non-obvious pattern was used:
- Add it to `.claude/rules/learned-patterns.md` with a code example
- Use this format:
  ```markdown
  ### [Pattern Name]
  **Learned:** [date]
  **Context:** [what feature triggered this]
  **Rule:** [the actual rule]
  **Example:**
  ```

If the pattern is universal PhyStack, consider adding to `phystack-screen.md` instead.

### 8e. Update Feature Spec
- Set status to `complete` in the feature spec frontmatter
- Add `completed: YYYY-MM-DD` date
- Note any deviations from the original plan
- If this feature significantly changed the project direction, note it in completion notes

### 8g. Update Design Docs
If the implementation diverged from the design spec:
- Update `docs/design/wireframes.md` if screen layout changed
- Update `docs/design/interaction-flows.md` if user journeys changed
- Update `docs/design/design-system.md` if new theme patterns were established
- Update the Design Spec section in the feature doc with what actually shipped

### 8f. Update Architecture Docs
If the implementation differs from the planned architecture:
- Update `docs/architecture/screen-flow.md` if screen flow changed
- Update `docs/architecture/settings-schema-design.md` if schema differs from plan
- Update `docs/architecture/signals-plan.md` if analytics events changed

### Reflection Questions
Answer these three questions during the reflect step:
1. **"What did I learn that would help me (or another agent) next time?"** -> Capture in rules/agents
2. **"What's changed that other files should know about?"** -> Update docs/README/CLAUDE.md
3. **"Is the documentation still accurate?"** -> Fix any drift

## Step 9: Stability Audit

Run `/stability-audit` on the changed components to check for resource leaks and always-on device issues:

1. Run `/stability-audit` scoped to the files changed in this feature
2. If critical or high issues are found, fix them before proceeding
3. Re-run `yarn test` and `yarn build` after any fixes

This step is required for features that add or change:
- `useEffect` hooks, timers, intervals, or animation frames
- Media streams, camera access, or hardware APIs
- WebSocket connections or persistent network requests
- State that accumulates across sessions
- Canvas, blob, or object URL usage

For features with no runtime resource changes (e.g., static UI, schema-only), note "No runtime resource changes — stability audit skipped" and proceed.

## Step 10: Create PR

```bash
git add -A
git commit -m "feat: NNN-feature-name - [brief description]"
git push -u origin feature/NNN-feature-name
gh pr create --title "feat: NNN-feature-name" --body "$(cat <<'EOF'
## Summary
[Brief description of the feature]

## Feature Spec
docs/features/NNN-feature-name.md

## Changes
- [List key changes]

## Test Plan
- [x] Unit tests pass
- [x] Lint passes
- [x] Build succeeds
- [x] Schema valid

## Reflect & Evolve
- [x] README.md updated
- [x] Feature spec marked complete
- [ ] New patterns captured (if any)
- [ ] Architecture docs updated (if changed)
EOF
)"
```

Present the PR URL to the user.

## Task Parallelization Guide

Within a feature, tasks can be organized for parallel execution when using agent teams:

```
T01: Schema changes            -> schema-developer  (no blockers)
T02: Design spec               -> ux-designer       (no blockers, parallel with T01)
T03: Write failing tests       -> ui-developer      (blocked by T01 + T02)
T04: Implement component       -> ui-developer      (blocked by T03)
T05: Integration wiring        -> ui-developer      (blocked by T04)
T06: Code review               -> reviewer          (blocked by T04, T05)
```

For simple features, a single agent can handle all tasks sequentially.
For complex features with independent components, consider using TaskCreate/TaskUpdate to parallelize.
