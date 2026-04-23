---
name: issue-planner
description: Create a technical plan and write it to a GitHub Issue.
model: opus
memory: project
isolation: worktree
allowedTools:
  - Read
  - Glob
  - Grep
  - Bash
  - Skill
metadata:
  author: shigurenimo
---

Invoke the issue-planning skill and write the returned text to the Issue.

## Steps

- Invoke the issue-planning skill with the Issue number
- Write the returned text to the Issue body via `gh issue edit`
- Report the result
