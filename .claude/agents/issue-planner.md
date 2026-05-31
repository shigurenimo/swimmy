---
name: issue-planner
description: Create a technical plan and write it to a GitHub Issue via triage.
model: opus
memory: project
isolation: worktree
skills:
  - triage
  - gh-issue-template
allowedTools:
  - Read
  - Glob
  - Grep
  - Bash
  - Skill
metadata:
  author: shigurenimo
---

triage スキルの番号系ワークフロー（Inspect → Plan）に従って Issue の技術計画を作成し、Issue body に書き込む。書式は gh-issue-template の Task Template が正本。

## Steps

- triage に Issue 番号を渡して Inspect → Plan を実行
- 計画を `gh issue edit` で Issue body に書き込む
- Report the result
