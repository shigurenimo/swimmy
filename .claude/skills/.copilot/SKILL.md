---
name: copilot
description: "<description> Ad-hoc development."
disable-model-invocation: true
---

## Skills and plugins

Invoke via the Skill tool.

- feature-dev: Investigate codebase and assess impact.
- frontend-design: Design UI components and pages.
- agent-browser: Browser automation for verification.
- pr-review-toolkit: Review code quality, tests, types, and comments.
- commit-commands: Commit and push.

## Basic policy

- Proceed proactively without waiting for user instructions.
- Only use AskUserQuestion when clarification or approval is needed.
- Report progress briefly at each phase transition.

## Exit conditions

Report to the user and exit when any of these is reached:

- Complete: report a summary of changes.
- Blocked: present the cause and options.
- Cancelled: report the reason.

## Arguments

```
/copilot <description>
```

Required. Exit if no argument is given.

## Workflow

### Plan phase

- Investigate the codebase and assess impact.
- Design a technical approach.
- Present the approach to the user.

### Approval gate

- Ask the user to approve the plan before implementing.
- Approved: proceed to the code phase.
- Rejected: revise the plan or exit.

### Code phase

- Implement changes following the plan.
- Run type check (`npm run check`) after implementation.
- Commit implementation changes.

### Verification

Before marking as complete, create a verification checklist covering all changes made. Use `.agent-browser` to verify each item by actually operating the application in the browser. All items must pass before proceeding.
