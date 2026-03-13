---
name: notion-task
description: "Fetch a task from Notion and save as a local backlog item."
user_invocable: true
arguments: タスク番号（TASK-222など）、またはバックログのslug名
---

Notion のタスクリストから指定された番号のタスクを取得し、ローカルのバックログファイルとして保存する。

## Skills and plugins

Invoke via the Skill tool.

- docs: バックログファイルのパス・フォーマットを参照する。
- backlog: ローカルファイルの作成・更新と壁打ち。
- notion-tasks-system: Notion のタスク検索・取得ルール。

## 手順

### Notion からタスクを取得

`notion-tasks-system` スキルのタスク一覧の取得手順に従い、指定されたタスク番号のタスクを取得する。

### ローカルファイルの作成・更新

backlog スキルを呼び出してローカルファイルを作成・更新する。backlog スキルの手順に従う。

取得した Notion タスクの情報をバックログファイルに反映する:

- FrontMatter に `reference-id` と `notion-page-id` を書き込む
- タスクのタイトルと内容を反映する

FrontMatter の例:

```yaml
---
reference-id: TASK-222
notion-page-id: abc-def-123
---
```

## やらないこと

- Notion への書き込み・更新（データの流れは Notion → ローカルの一方向）
- Notion のページ本文の作成・更新
- バックログファイル以外のローカルファイルの操作
