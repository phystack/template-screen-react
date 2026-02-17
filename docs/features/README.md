# Feature Specs

This directory contains individual feature specifications — the **living specification** for this project after `/setup`.

## Role

After `/setup` decomposes the project brief into features, features become the primary specification. Each feature is **self-contained** — agents should not need to read the project brief to implement a feature. All relevant context (screens, settings, constraints, integrations) is embedded directly in the feature spec.

## JTBD Traceability

Each feature maps to one or more Jobs to Be Done (JTBD) from the project brief via the `jobs` frontmatter field. The actual job statements are included in the feature's `## Jobs Addressed` section, so agents have full context without cross-referencing.

## Naming Convention

Feature specs follow the pattern: `NNN-feature-name.md`

- `NNN` = three-digit number (001, 002, ...) indicating recommended implementation order
- `feature-name` = kebab-case description

## Lifecycle

1. **Generated** by `/setup` during onboarding (status: `pending`)
2. **Refined** during `/feature` planning phase (status: `in-progress`)
3. **Updated** during implementation (schema changes, new requirements)
4. **Completed** by `/feature` reflect step (status: `complete`)

## Feature Status

Each spec has a `status` field in its frontmatter:
- `pending` — Not yet started
- `in-progress` — Currently being implemented
- `complete` — Implementation done, tests passing, PR merged

## The `[NEEDS CLARIFICATION]` Pattern

When creating or refining features, agents flag unknowns with `[NEEDS CLARIFICATION: description]` markers instead of guessing. These markers signal that a human decision is needed before implementation can proceed.

## Working with Features

```
/feature NNN-feature-name    # Start TDD workflow for this feature
```

If no spec exists for the feature name, `/feature` will create one interactively.

## Template

See `_template.md` for the feature spec format.
