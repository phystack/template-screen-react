---
name: learn
description: "Capture a correction or feedback as a rule. Use when you've corrected the agent and want to prevent the same mistake in future."
user-invocable: true
allowed-tools: Read, Write, Edit, Grep, Glob
---

# Learn from Feedback

Capture corrections and feedback as reusable rules to prevent the same mistakes. Rules are stored in `.claude/rules/` and automatically applied to all future development.

## Usage

```
/learn <description of what was wrong and the correct approach>
```

## Step 1: Understand the Correction

Parse the user's feedback to identify:
- What was done wrong (the mistake or anti-pattern)
- What should be done instead (the correct approach)
- Why it matters (context for future reference)

## Step 2: Check Existing Rules

Search `.claude/rules/` for overlapping or contradictory rules:

Read all files in `.claude/rules/` and check if:
- This rule already exists (avoid duplication)
- This contradicts an existing rule (flag to user)
- This extends an existing rule (update rather than create new)

## Step 3: Determine the Right File

Based on the type of correction:

| Type | File | Examples |
|------|------|---------|
| PhyStack SDK patterns | `phystack-screen.md` | Settings conventions, Hub Client usage, schema patterns |
| ES2015/Tizen issues | `tizen-compat.md` | Forbidden syntax, browser compat, polyfill needs |
| Testing patterns | `tdd.md` | Test structure, mocking patterns, what to test |
| App domain rules | `app-specific.md` | Business logic, domain conventions, UX rules |
| Discovered conventions | `learned-patterns.md` | Patterns learned during development |

If unsure, default to `learned-patterns.md` — it can be promoted to a topic file later.

## Step 4: Propose the Rule

Present to the user:

```
I'll add this rule to `.claude/rules/[filename]`:

### [Pattern Name]
**Learned:** [today's date]
**Context:** [what triggered this learning]
**Rule:** [the actual rule, concise and actionable]
**Example:**
// Bad
[code example of what NOT to do]

// Good
[code example of what TO do]

Does this look right?
```

Wait for user confirmation.

## Step 5: Write the Rule

If confirmed:
1. Read the target rules file
2. Append the new rule at the end (before any closing comments)
3. Confirm the update to the user

## Step 6: Check Agent Impact

Consider if any agent files should also be updated:
- Does this rule affect how the ui-developer builds components?
- Does this rule affect how the schema-developer writes schemas?
- Does this rule affect what the reviewer checks?

If so, propose the agent update to the user as a follow-up:
> "This rule also applies to the [agent-name] agent. Should I update `.claude/agents/[agent-name].md` to reference this pattern?"

## Notes

- Keep rules concise and actionable — agents read these on every task
- Include code examples whenever possible (bad -> good)
- Date-stamp every learned pattern for future review
- If a rule applies broadly across PhyStack projects, note that it might belong in the workspace-level rules
- Deduplication: if a similar rule exists, update it rather than creating a new one
