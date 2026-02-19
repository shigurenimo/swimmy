---
name: copilot-standalone
description: Local development workflow without Notion or GitHub. Same as copilot but fully local.
disable-model-invocation: true
---

# Copilot Standalone

copilot と同じワークフローで動作するが、外部サービス（Notion・GitHub）を使用しない。全てローカルで完結する。

## copilot との違い

| | copilot | copilot-standalone |
|---|---|---|
| タスク管理 | Notion | `.claude/issues/` ローカルファイル |
| Issue 管理 | GitHub Issue | ローカルファイルの番号管理 |
| PR | GitHub PR | なし（コミットまで） |
| 通知 | macOS + channel | macOS のみ |

## 起動方法

copilot と同じ引数形式を受け付ける。意図を解釈して適切なフローに振り分ける。

```bash
/.copilot-standalone                         # 引数なし: 現在の作業状況を確認
/.copilot-standalone issue 3                 # Issue 3 を実装
/.copilot-standalone ログイン機能を追加      # 自然言語: 新規 Issue を作成して実装
```

意図が不明な場合は AskUserQuestion で確認する。

## あなたが使うスキル

- `claude-issues`: ローカル Issue の作成・更新・ステータス管理
- `docs`: 仕様書の構造とルールを理解
- `copilot-notification`: macOS 通知（channel 送信はスキップ）
- `superpowers:writing-plans`: 実装計画の作成

## teammateに指示するスキル

各 teammate には対応するスキルを展開するよう指示する:

- `copilot-issue`: Issue の実装（GitHub 操作なし）
- `copilot-task-planner`: 新機能の仕様計画
- `copilot-code-scan`: コードの不具合探し
- `copilot-docs-scan`: 仕様書の問題発見

## 動作モードの切り替え

copilot と同じ3モード（自動/中止/対話）で動作する。詳細は copilot の @references/member-interactions.md の「動作モードの切り替え」を参照。

### 自動モード（自走）

Issue ステータスを `in_progress` に更新 → 実装を teammate に委任（`use-worktree=true` で起動）→ 完了後にコミット → ステータスを `completed` に更新 → `copilot-notification` で通知 → ユーザーに報告

### 中止モード

Issue ステータスを `blocked` に更新 → `copilot-notification` で通知 → ユーザーに理由と次のアクションを報告

### 対話モード

引数なし起動または中止後は `AskUserQuestion` で確認しながら進める。

Issue が1件の場合は `use-worktree=false` で teammate を起動する。2件以上を同時に進める場合は `use-worktree=true` で起動する。

## 基本的な流れ

### 引数なしの起動フロー

copilot の @references/no-args-flow.md と同じ流れ。Notion の代わりに `.claude/issues/` からタスクを取得する。

### 引数ありの起動フロー

copilot と同じ意図解釈で対応する。タスク・Issue はすべてローカルファイルで管理する。

## Agent Teams

全ての実装作業は teammate に委任する。直接ファイルを読み書きしてはならない。

起動時に `TeamCreate` でチームを作成する。teammate との詳細なやりとりは copilot の @references/member-interactions.md に準ずる。ただし Notion ステータス更新の代わりに `claude-issues` でローカルファイルを更新し、PR 作成は行わない。

## ステータス更新時のログ記録

`claude-issues` でステータスを更新するたびに、Issue ファイルの末尾に更新ログを追記する。

```markdown
## 更新履歴

- 2026-02-19 in_progress: 実装開始
- 2026-02-19 completed: コミット完了
```

## 承認が必要な場合

ユーザーの承認が必要になった場合、承認用の新規 Issue ファイルを作成する。

プロパティ:

- status: pending
- priority: high
- 概要: 「[親 Issue 名] の承認」
- 対応内容: 承認が必要な理由と判断してほしい内容

## 注意事項

- Notion は使用しない（`claude-issues` で代替）
- GitHub Issue・PR は使用しない（コミットまで）
- 環境変数は不要
