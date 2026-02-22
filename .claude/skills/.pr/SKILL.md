---
name: pr
description: "[number] GitHub PR. Lists if omitted."
---

## Skills and plugins

Invoke via the Skill tool.

- gh-pr-template: PR template, formatting, and required sections.
- feature-dev: Investigate codebase and assess impact.
- frontend-design: Design UI components and pages.
- .agent-browser: Browser automation for verification.
- .docs-update: Sync product specifications with code changes.
- superpowers: Spawn parallel agents, create plans, review code.
- pr-review-toolkit: Review code quality, tests, types, and comments.
- commit-commands: Commit, push, and open PRs.

## Reporting

- Report at the start and end of each action.

## Exit conditions

Report to the user and exit when any of these is reached:

- Complete: PR is updated and ready. Report what was done.
- Blocked: problem encountered. Present the cause and options.
- Cancelled: user requested stop. Report the reason.

## Arguments

```
/pr [number]
```

No argument: run `gh pr list` for open PRs, display as a formatted list, then exit.

With argument: fetch the PR by number and manage it (review, update, fix).

## Workflow

### List display (no argument)

Fetch open PRs via `gh pr list` and display as a list.

```
├─ #[**112**](https://github.com/.../pull/112) fix: オフセット修正 `OPEN`
├─ #[**113**](https://github.com/.../pull/113) fix: リダイレクト先を修正 `DRAFT`
└─ #[**114**](https://github.com/.../pull/114) feat: 新機能追加 `OPEN`
```

Rules:

- `#` outside the link; number bold and linked to GitHub URL
- Status as inline code at the end of the line

Exit after display.

### With number

- Fetch the PR details, diff, and check status.
- Determine what action is needed:
  - Failing checks: investigate and fix.
  - Review comments: address feedback.
  - Ready to merge: report status.
  - Needs update: rebase or resolve conflicts.
- Implement fixes, commit, and push.
- Create a verification checklist covering all fixes. Use `.agent-browser` to verify each item by actually operating the application in the browser. All items must pass.
- Invoke `.docs-update` to sync product specifications in `.docs/` with the changes made. Commit the doc updates.
- Report the result and exit.
