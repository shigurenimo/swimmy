---
name: pr
description: "[number] Implement a GitHub Issue and create a PR."
user_invocable: true
arguments: Issue 番号
---

Issue の計画に基づいて実装し、PR を作成する。

## Arguments

```
/pr {number}
/pr
```

番号あり: その Issue を取得して実装を開始する。

番号なし: 会話中の Issue に紐づく PR を `gh pr list` で探す。PR があればそのブランチをチェックアウトするか確認する。PR がなければブランチを新規作成するか確認する。

## Skills and plugins

Invoke via the Skill tool.

- feature-dev: Investigate codebase and assess impact.
- frontend-design: Design UI components and pages.
- agent-browser: Browser automation for verification.
- superpowers: Spawn parallel agents, create plans, review code.
- pr-review-toolkit: Review code quality, tests, types, and comments.
- commit-commands: Commit, push, and open PRs.
- gh-pr-template: PR template, formatting, and required sections.

## Team

Create a team and delegate work to teammates. This saves context in the main session.

| Role | Name | subagent_type | Purpose |
|---|---|---|---|
| Hacker | `hacker` | `hacker` | Security testing on localhost after implementation. |
| Debugger | `debugger` | `debugger` | Review changes for bugs and code quality issues. |

## Workflow

### Branch

`{issue番号}-{自然な英文}` のブランチを切る。例: `42-fix-pagination-offset`

### Code phase

Issue のタスクリストに沿って実装する。タスクを完了したらチェックを入れる。適宜コミットする。

### Security phase (optional)

ユーザー入力、認証、データ処理に関わる変更がある場合、`hacker` を起動してセキュリティテストを行う。

### Verification

変更内容のチェックリストを作成し、`agent-browser` でブラウザ上で実動作を確認する。全項目パスしてから次に進む。

### Debug phase

`debugger` を起動して変更をレビューする。軽微な問題はその場で修正、重大な指摘は返される。

### Triage

debugger の指摘をユーザーに提示し、対応を確認する。軽微なものはその場で修正してコミットする。計画が必要なものは新しい GitHub Issue を作成する。

### Pull Request

commit-commands:commit-push-pr でプッシュして PR を作成する。gh-pr-template スキルに従う。
