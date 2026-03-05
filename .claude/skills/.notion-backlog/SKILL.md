---
name: notion-backlog
description: "Create or update a backlog item and sync to Notion."
user_invocable: true
arguments: 課題の内容、またはバックログのslug名
---

backlog スキルでローカルファイルを作成・更新し、Notion にも同期する。

## Skills and plugins

Invoke via the Skill tool.

- backlog: ローカルファイルの作成・更新と壁打ち。
- notion-tasks-system: Notion のページ作成・更新ルール。

## 手順

### ローカルファイルの作成・更新

backlog スキルを呼び出してローカルファイルを作成・更新する。backlog スキルの手順に従う。

### Notion 同期

backlog スキル完了後、作成・更新されたファイルを読んで Notion に同期する。

`.docs/backlogs/{slug}.md` から以下を抽出する:

- FrontMatter の `notion-page-id`（存在する場合）
- `# {見出し}` からタイトル
- `## 判断` セクションの内容からステータス（未定 / 開発する / 見送り）

ステータスのマッピング: 未定 → 未着手、開発する → 計画待ち、見送り → 中止。実際のプロパティ名と選択肢は fetch 結果に従う。

notion-page-id がなければ `notion-tasks-system` スキルの手順でページを新規作成し、FrontMatter に `notion-page-id` を書き込む。

notion-page-id があれば `notion-tasks-system` スキルの手順でタイトルとステータスのみ更新する。

## やらないこと

- Notion のページ本文の作成・更新
- notion-page-id とタイトル・ステータス以外のプロパティの操作
