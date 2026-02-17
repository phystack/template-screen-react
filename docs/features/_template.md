---
id: NNN
title: Feature Title
status: pending
priority: high | medium | low
depends-on: []
---

# NNN - Feature Title

## Overview
Brief description of the feature and its purpose.

## User Story
As a [user type], I want to [action] so that [benefit].

## Screen(s)
Which screens this feature affects or creates.

## Schema Changes
Settings that need to be added or modified in `src/schema.ts`.

```typescript
// New settings to add
```

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

_Agent: ux-designer — skip this section with a note if the feature has no UI changes._

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Test Plan
- [ ] Unit tests for component logic
- [ ] Integration tests for settings consumption
- [ ] Visual verification on target device dimensions

## Technical Notes
Implementation guidance, patterns to follow, potential gotchas.

## Agent Assignment
- **Design spec**: ux-designer
- **Schema changes**: schema-developer
- **UI implementation**: ui-developer
- **Review**: reviewer
