---
id: NNN
title: Feature Title
status: pending | in-progress | complete
created: YYYY-MM-DD
completed: YYYY-MM-DD
priority: high | medium | low
jobs: [J-001, J-002]
depends-on: []
---

# NNN - Feature Title

## Context
[Self-contained: relevant screens, settings schema fields, PhyStack integrations,
hardware constraints, design references — everything an agent needs to implement
this feature WITHOUT reading the project brief]

## Jobs Addressed
- J-001: When [situation], I want to [motivation], so I can [outcome]

## Functional Requirements
- FR-001: MUST [requirement]
- FR-002: SHOULD [requirement]
- [NEEDS CLARIFICATION: describe what's unclear]

## Design Spec

### Wireframe
```
[Text-based wireframe annotated with settings.theme.* and settings.* references]
```

### Component Breakdown
| Component | Purpose | Settings Consumed | States |
|-----------|---------|-------------------|--------|
| | | | default, loading, error, empty |

### Interaction Sequence
1. User [action]
2. App [response]
3. User [next action]

### Error States
- [Error condition] → [What user sees]

### Accessibility
- ARIA roles: [roles used]
- Focus management: [focus strategy]
- Contrast: [contrast requirements met]

_Skip with note if no UI changes._

## Acceptance Criteria
- Given [context], When [action], Then [expected result]
- Given [context], When [action], Then [expected result]

## Test Plan
- [ ] [Test category]: [specific test]

## Schema Changes
Settings to add/modify in `src/schema.ts`.

```typescript
// New settings to add
```

## Agent Assignment
- **Design spec**: ux-designer
- **Schema changes**: schema-developer
- **UI implementation**: ui-developer
- **Review**: reviewer
