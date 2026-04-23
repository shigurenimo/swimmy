---
name: issue
description: "?"
metadata:
  author: shigurenimo
  dev: true
---

GitHub Issue を作成・更新・調査・計画するためのスキル。Issue は技術的な実装計画とコンテキストを残す場所で、Claude が別セッションで作業を再開するとき、ここに書かれた情報だけで意思決定の経緯と実装方針を再現できる状態にする。

## Arguments

```
/issue {number}
/issue {description}
```

番号あり: その Issue を取得して調査・計画する。

番号なし: description から新規 Issue を作成する。作成前に `gh issue list` で重複をチェックし、重複があれば既存 Issue を使うか新規作成するかをユーザーに確認する。

## Workflow

### Plan phase

`issue-planning` スキルを使って技術計画を作成し、Issue body に書き込む。

### Report

計画をユーザーに提示し、実装に進むか確認する。

- 進める: `pr` スキルを起動して実装を続行
- 止める: ワークフロー終了

## Template の一次ソース

テンプレート本体はリポジトリの `.github/ISSUE_TEMPLATE.md`（単一デフォルト方式）に置く。Issue 作成時はこのファイルを読み込んで埋める。ブラウザから Issue を開いたときも同じ雛形が自動適用される。

## Template の自動作成

Issue を作成する前にリポジトリの `.github/` をチェックし、次の条件分岐で処理する。

- `.github/ISSUE_TEMPLATE.md` が存在する → そのまま使う
- `.github/ISSUE_TEMPLATE.md` も `.github/ISSUE_TEMPLATE/` ディレクトリも存在しない → 下記「Template」セクションの内容で `.github/ISSUE_TEMPLATE.md` を新規作成し、同じコミットに含める
- `.github/ISSUE_TEMPLATE/` ディレクトリが既に存在する → 自動作成はスキップする。オーナーに「単一テンプレートに統一しますか？」と確認し、承認を得てからディレクトリ削除＋単一ファイル作成を行う。勝手にディレクトリを削除しない

## Purpose

- 実装に必要な技術的コンテキストを失わないよう記録する
- Claude が後で読み返したとき、思考の流れと判断理由を追えるようにする
- 冒頭の概要だけは人間（非開発者含む）が読んで状況を把握できるようにする

## Rules

- 冒頭の概要は人間向け。技術用語を避け、何を・なぜ変えるかを自然な文章で書く（見出しなし）
- 必須セクションは固定。順序を変えない
- 必須セクションの後に、任意セクションを自由に追加してよい
- Claude が残したい情報（調査メモ、検討した代替案、試行錯誤の記録など）は何でも書いてよい
- Notion タスクが存在する場合は冒頭に `[TASK-{番号}](Notion URL)` を記載し、タイトルに `TASK-{番号} - ` を付与する

## Template

```
[人間向けの概要。何を・なぜ変更するのか。背景と目的を自然な文章で書く]

## Technical Challenges

[影響するファイル・API・データ構造・実装上の懸念など技術的な事実を列挙する]

## Plan

[実装方針とその理由。なぜこのアプローチを選んだか、どのような手順で進めるか、考慮したトレードオフを自然な文章で説明する。箇条書きだけでなく、思考の流れを追えるレベルの詳細さが必要]

### Tasks

- [ ] タスク1
- [ ] タスク2
```

## Required Sections

- 冒頭の概要（見出しなし）
- Technical Challenges
- Plan（Tasks サブセクションを含む）

## Optional Sections

必須セクションの後に自由に追加してよい。例:

- Notes - 参考情報、関連ファイル、ワークアラウンド
- Research - 調査内容、参考資料、読んだドキュメント
- Alternatives Considered - 検討した代替案と却下理由
- Debug Log - デバッグの過程と発見
- Dependencies - 依存関係、前提条件
- Migration - データ移行やスキーマ変更の詳細

## Labels

| Label | 説明 |
|---|---|
| `bug` | 何かが正しく動作していない |
| `enhancement` | 新機能の追加、既存機能の改善 |
| `documentation` | 仕様書、README、コメントの追加・修正 |
| `refactoring` | 動作を変えずにコードを整理 |
| `testing` | テストの追加・修正 |
| `security` | セキュリティ上の問題 |
| `performance` | パフォーマンス改善 |

複数のラベルを付与してよい（例: `bug` + `security`）

## Skills and plugins

Invoke via the Skill tool.

- `issue-planning`: Create technical plan text for an Issue.
- `feature-dev`: Investigate codebase and assess impact.
- `superpowers`: Spawn parallel agents, create plans, review code.
