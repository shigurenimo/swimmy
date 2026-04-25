---
name: pr
description: Implement an Issue and open its PR.
when_to_use: Implementing a GitHub Issue and creating its PR. Takes Issue number or context.
user_invocable: true
arguments: Issue 番号
metadata:
  author: shigurenimo
  description: Issue の計画に基づいて実装し、verification・debug を経て PR を作成するスキル。PR には実装結果のみを記録する。
  dev: true
  tools: gh, playwright, agent-browser
---

Issue の計画に基づいて実装し、PR を作成する。PR は実装結果を記録する場所で、計画や技術的な意思決定の記録は Issue に書く。PR には書かない。

## Arguments

```
/pr {number}
/pr
```

番号あり: その Issue を取得して実装を開始する。開始前に `gh pr list --search "{number} in:body" --state all` で紐づく PR の有無を確認する。既存 PR があれば「既存 PR に乗る / 新規作成する」をユーザーに確認する。

番号なし: 会話中の Issue に紐づく PR を `gh pr list` で探す。PR があればそのブランチをチェックアウトするか確認する。PR がなければブランチを新規作成するか確認する。

## Team

lead（本体）が司令塔として常駐し、実装中は必要に応じてサブエージェントをメンバー化して委任する。

| Role                 | subagent_type      | いつ追加するか                                                                             |
| -------------------- | ------------------ | ------------------------------------------------------------------------------------------ |
| Playwright generator | `playwright-agent` | ブラウザ上で動く機能を変更した場合。3 名並列で別テストファイルを分担させてテストを生成する |
| Debugger             | `debugger`         | 実装完了後の Debug phase で毎回起動し、変更をレビューさせる                                |
| Hacker               | `hacker`           | ユーザー入力・認証・データ処理に関わる変更がある場合のみ Security phase で起動する         |

### playwright-agent が未インストールの場合

`.claude/agents/playwright-*.md` や `@playwright/cli` がプロジェクトに無ければ、実装に入る前に `bootstrap` スキルで Playwright と playwright-agent を導入する。導入後、生成された agent を Team のメンバーとして追加してから進める。

## Workflow

### Branch

`{issue番号}-{自然な英文}` のブランチを切る。例: `42-fix-pagination-offset`。既存 PR に乗る場合は `gh pr checkout {pr番号}` でチェックアウトする。

### Code phase

Issue のタスクリストに沿って実装する。タスクを完了したらチェックを入れる。適宜コミットする。

### Security phase (optional)

ユーザー入力、認証、データ処理に関わる変更がある場合、`hacker` を Team に追加してセキュリティテストを行う。該当しない変更ではスキップする。

### Verification

変更内容のチェックリストを作成し、実動作を確認する。

- ブラウザで動く機能: `playwright-agent` を 3 名並列で Team に追加し、別テストファイルを分担させて `bunx playwright test` が通るまで修正させる
- それ以外: `agent-browser` や実コマンド実行で動作確認する

全項目パスしてから次に進む。

### Debug phase

`debugger` を Team に追加して変更をレビューする。軽微な問題はその場で修正、重大な指摘は Triage に回す。

### Triage

debugger の指摘をユーザーに提示し、対応を確認する。軽微なものはその場で修正してコミットする。計画が必要なものは新しい GitHub Issue を作成する。

### Pull Request

commit-commands:commit-push-pr でプッシュして PR を作成する。下記「Template」「Rules」「Required Sections」に従う。

## Template の一次ソース

テンプレート本体はリポジトリの `.github/PULL_REQUEST_TEMPLATE.md` に置く。PR 作成時はこのファイルを読み込んで埋める。ブラウザから PR を開いたときも同じ雛形が自動適用される。

## Template の自動作成

PR を作成する前にリポジトリの `.github/PULL_REQUEST_TEMPLATE.md` をチェックする。存在しなければ下記「Template」セクションの内容で新規作成し、同じコミットに含める。既に存在する場合はそのまま使い、勝手に上書きしない。

## Purpose

- 何が変わったかを人間がレビューできるようにする
- 動作確認の結果を残す
- 実装中に気づいた補足情報を記録する

## Rules

- 冒頭の概要は人間向け。何が変わるか、何が良くなるかを自然な文章で書く
- 計画は書かない（Issue の Plan セクションに書く）
- 必須セクションは固定。順序を変えない
- 必須セクションの後に、任意セクションを自由に追加してよい
- Claude が残したい実装メモは何でも書いてよい
- プロパティ形式（「リスク評価:」など）は使わない
- Notion タスクが存在する場合は closes 行に `[TASK-{番号}](Notion URL)` を追記する

## Template

```
closes #<Issue番号>

[人間向けの概要。何が変わるか、何が良くなるかを自然な文章で書く。リスクや影響があれば触れる]

## Verification

- [ ] 対象機能の動作確認
- [ ] 既存機能への影響確認
```

## Required Sections

- closes 行（Issue リンク）
- 冒頭の概要（見出しなし）
- Verification（実際にブラウザ操作や API 呼び出しで確認した内容。test/build などの技術的チェックは含めない）

## Optional Sections

Verification の後に自由に追加してよい。例:

- Implementation Notes - 実装時に気づいた点、特殊な対応、次回への申し送り
- Breaking Changes - 破壊的変更の詳細
- Screenshots - UI 変更がある場合

## Skills and plugins

Invoke via the Skill tool.

- `bootstrap`: Install Playwright and playwright-agent when missing.
- `feature-dev`: Investigate codebase and assess impact.
- `frontend-design`: Design UI components and pages.
- `agent-browser`: Browser automation for verification.
- `superpowers`: Spawn parallel agents, create plans, review code.
- `pr-review-toolkit`: Review code quality, tests, types, and comments.
- `commit-commands`: Commit, push, and open PRs.
