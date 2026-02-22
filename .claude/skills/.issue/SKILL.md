---
name: issue
description: "[number] GitHub Issue. Lists if omitted."
---

## Arguments

```
/issue [number]
```

No argument: run `gh issue list` for open issues, fetch linked PRs for each, display as a tree, then exit.

With argument: fetch the issue by number and resume work.

## Skills

Invoke via the Skill tool.

- gh-issue-template: Issue template, labels, and formatting rules.
- gh-pr-template: PR template, formatting, and required sections.
- .agent-browser: Browser automation for verification.
- .docs-update: Sync product specifications with code changes.
- commit-commands: Commit, push, and open PRs.

## Team

Create a team named `issue-{number}` and delegate work to teammates. This saves context in the main session.

| Role | Name | subagent_type | Purpose |
|---|---|---|---|
| Planner | `issue-{number}-planner` | `planner-issue` | Plan phase. Investigate codebase, write Technical Challenges and Plan to the issue. |
| Hacker | `issue-{number}-hacker` | `hacker` | Security testing on localhost after implementation. |
| Code Debugger | `issue-{number}-debugger-code` | `debugger-code` | Find code bugs and quality issues. |
| Docs Debugger | `issue-{number}-debugger-docs` | `debugger-docs` | Find doc inconsistencies. |

## Exit conditions

Report to the user and exit when any of these is reached:

- Complete: no more work to do. Report a summary of all changes.
- Blocked: problem encountered. Present the cause and options.
- Cancelled: user requested stop. Report the reason.

## Workflow

### Tree display (no argument)

Fetch open issues via `gh issue list`, then fetch linked PRs for each issue.

Display as a tree with PRs nested under their parent issue.

```
├─ #[**91**](https://github.com/.../issues/91) ページネーション不具合
│  └─ #[**112**](https://github.com/.../pull/112) fix: オフセット修正
│
├─ #[**94**](https://github.com/.../issues/94) 文字数カウント不具合
│
└─ #[**87**](https://github.com/.../issues/87) リダイレクト不具合
   └─ #[**113**](https://github.com/.../pull/113) fix: リダイレクト先を修正
```

Rules:

- `#` outside the link; number bold and linked to GitHub URL
- PRs indented under their parent issue with `├─` / `└─`
- Empty `│` line between issue groups for readability

Exit after display.

### Plan phase

Spawn `issue-{number}-planner` and pass the issue number. Prompt must include: "Plan issue #{number} only. Do not loop to other issues." The planner investigates the codebase, designs a technical approach, and writes Technical Challenges and Plan to the issue. Wait for the planner to finish.

### Approval gate

Present the plan to the user and ask for approval.

- Approved: proceed to the code phase.
- Rejected: comment the reason on the issue and exit.

### Code phase

Implement changes following the task list in the issue. Check off tasks as completed. Commit as needed.

### Security phase (optional)

If the changes involve user input, authentication, or data handling, spawn `issue-{number}-hacker` to run security testing on localhost.

### Verification

Before marking as complete, create a verification checklist covering all changes made. Use `.agent-browser` to verify each item by actually operating the application in the browser. All items must pass before proceeding.

### Docs update

Invoke `.docs-update` to sync product specifications in `.docs/` with the changes made. Commit the doc updates.

### Completion

Report a summary of changes and verification results.

### Debug phase

After completion, spawn `issue-{number}-debugger-code` and `issue-{number}-debugger-docs` in parallel. They fix trivial issues on the spot and return non-trivial findings.

### Triage

Review findings from debuggers and triage each one. Ask the user how to handle each finding:

| Effort | Action |
|---|---|
| Trivial (typo, format) | Fix immediately and commit |
| Small, no planning needed | Create a new ticket (.claude/tickets/) |
| Needs planning | Create a new GitHub Issue |

Maximum level for this skill: GitHub Issue. Do not create Notion tasks.

### Loop

After triage, if new tickets or issues were created, pick the next actionable item and repeat from the Plan phase. Exit when there is nothing left to do.
