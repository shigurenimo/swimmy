---
name: issue
description: "[number|description] Investigate and plan GitHub Issues."
---

## Arguments

```
/issue {number}
/issue {description}
```

With number: Fetch the Issue and investigate/plan it.

Without number: Create a new Issue from the description. Before creating, check `gh issue list` for duplicates. If a duplicate exists, ask the user whether to use the existing Issue or create a new one.

## Skills and plugins

Invoke via the Skill tool.

- plan-issue: Create technical plan text for an Issue.
- feature-dev: Investigate codebase and assess impact.
- superpowers: Spawn parallel agents, create plans, review code.
- gh-issue-template: Issue template, labels, and formatting rules.

## Workflow

### Plan phase

Use the plan-issue skill to create a technical plan and write it to the Issue body.

### Report

Present the plan to the user and ask whether to proceed with development.

- Proceed: Invoke the pr skill to continue with implementation.
- Stop: End the workflow.
