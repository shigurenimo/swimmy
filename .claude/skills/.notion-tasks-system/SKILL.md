---
name: notion-tasks-system
description: Notion task template and guidelines for creating tasks
---

# Notion タスク テンプレートとガイドライン

## 前提条件

必須:

- Notion テーブル ID: !`echo $CUSTOM_NOTION_TABLE_TASK_ID`

タスク作成時のみ必須:

- リポジトリ: !`echo $CUSTOM_REPOSITORY_ID`

任意:

- Notion user ID: !`echo $CUSTOM_NOTION_USER_ID`
- 事業: !`echo $CUSTOM_NOTION_BUSINESS_UNIT`

必須環境変数が未設定の場合はスキルを中断する。タスク作成時のみ必須の環境変数は、作成操作時に未設定なら中断する。任意環境変数は未設定でも確認せず続行する。

## タスク作成時の共通プロパティ

Notion のページ作成ツールでタスクページを作成する。`parent` には `data_source_id` を指定する。

共通プロパティ:

- 内容: タスク名
- 担当者: `CUSTOM_NOTION_USER_ID` の値。未設定なら `notion-get-users` で `~/.claude/CLAUDE.md` の `notion_user_id` と照合して取得。取得できない場合は省略
- リポジトリ: 環境変数 `CUSTOM_REPOSITORY_ID` の値
- 事業: 環境変数 `CUSTOM_NOTION_BUSINESS_UNIT` の値（未設定の場合は省略）
- タグ: Claude(必ず付与)
- 重要度: 高 / 中 / 低
- ステータス: 未着手(Manager の承認待ち)

## ページ本文の書き方

Notion ページは非開発者（経営者・企画担当者）が読む。技術的な内容（ファイル名、関数名、テーブル名、コードなど）は一切書かない。詳細は GitHub Issue に書く。

メモ程度に端的に書く。見出しは不要。以下を簡潔にまとめる:

- 誰のために: どのユーザー・顧客に影響するか
- 何をするか: 何が変わるか・できるようになるか
- なぜ必要か: 放置するとどんな問題があるか

破壊的な仕様変更（ユーザーの操作方法が変わる、既存のデータに影響があるなど）がある場合は追記する。

## サブタスクの使い方

関連する作業を階層で整理する場合、Notion のサブタスク機能を使う。

サブタスクを使う場面:

- 同じ問題の複数の側面（例: ログイン・登録・ログアウトのそれぞれで同じバグがある）
- 同じ目的のための段階的な作業（例: フェーズ1・フェーズ2）

構成ルール:

- 親タスクも子タスクも、それぞれ個別に GitHub Issue と 1:1 で対応する（親子の区別なく全て 1:1）
- GitHub Issue は開発に着手すると決まったときに作成する。着手が決まっていない Notion タスクには Issue が存在しなくてよい

## コメントの書き方

Notion のコメントは1行の更新履歴にする。コミットメッセージのように簡潔に書く。長文の計画や詳細は書かない。

例: 「visibility フィルタの修正を実装、PR #17」

## タスクのステータス

Notion の「ステータス」カラムで管理する。

| ステータス | 意味 | 次のアクション |
|---|---|---|
| 未着手 | まだ誰も着手していない | Manager が計画待ちに変更するまで待つ |
| 計画待ち | Manager が着手を承認済み | task-planner が仕様計画を開始 → 計画中へ |
| 計画中 | task-planner が仕様計画を作成中 | 計画完了 → 計画確認待ちへ |
| 計画確認待ち | 仕様計画完了、承認待ち | Manager/オーナーが確認 → 作業待ちへ |
| 計画中止 | 計画段階で人間の承認が必要と判断し放棄 | オーナーが copilot スキルで実装を開始 |
| 作業待ち | 仕様承認済み、実装開始待ち | issue-{番号} メンバーが実装 → 作業中_CLAUDE へ |
| 作業中_CLAUDE | Claude が自走で実装中 | PR 完成 → 作業確認待ちへ |
| 作業確認待ち | PR レビュー待ち | オーナーが確認・マージする（Claude はマージしない） |
| 作業中止 | 作業中に人間の承認が必要と判断し放棄 | オーナーが copilot スキルで実装を開始 |
| 完了 | リリース済み | - |
| 中止 | 取りやめ | - |

### 却下時のステータス遷移

作業確認待ちで却下された場合、理由に応じてステータスを変更する。

| 理由 | 遷移先 |
|---|---|
| 計画からやり直し | 計画待ち |
| 要件の見直しが必要 | 未着手 |
| 対応不要だった | 中止 |
| すでに解決済みだった | 完了 |

## タスクの取得手順

全て `mcp__notion__` (Notion公式MCP) のツールを使う。`mcp__claude_ai_Notion__` は使用しない。

### ID 指定でタスクを取得する (推奨)

`mcp__notion__API-query-data-source` でプロパティフィルタを使う:

```
data_source_id: {Notion テーブル ID}
filter: {
  "property": "ID",
  "unique_id": {
    "equals": 389
  }
}
```

レスポンスの `results` 配列にマッチしたページが返る。各ページの `properties` からタイトル、ステータス、担当者などを取得できる。

### ステータスや担当者でフィルタする

```
filter: {
  "property": "状態",
  "status": {
    "equals": "作業待ち"
  }
}
```

複合フィルタも可能:

```
filter: {
  "and": [
    { "property": "状態", "status": { "equals": "作業待ち" } },
    { "property": "リポジトリ", "select": { "equals": "uninoverse-workers" } }
  ]
}
```

### キーワードでタスクを検索する

タイトルでタスクを探す場合は `mcp__notion__API-post-search` を使う:

- `query` にキーワードを指定する
- タイトル一致検索（セマンティック検索ではない）

### 個別タスクの詳細を取得する

- プロパティ: `mcp__notion__API-retrieve-a-page` でページIDを指定して取得する
- ページ本文: `mcp__notion__API-get-block-children` でページIDを `block_id` に指定して取得する

### 認証エラー時の対処

`mcp__notion__` のツールで 401 エラー (unauthorized) が発生した場合:

1. ユーザーに Notion API トークン（`ntn_` で始まる文字列）を聞く
2. `~/.claude/settings.json` の `env.NOTION_TOKEN` にトークンを書き込む
3. Claude Code の再起動が必要な旨を伝える

## 重要な注意事項

- MCP サーバー: `mcp__notion__` (Notion公式MCP) のみを使用する。`mcp__claude_ai_Notion__` は使用しない
- データソース: タスクDBのデータソースIDは Notion テーブル ID と同じ値を使う
- Claude タグ: 作成時に `Claude` タグを必ず付与する
- 担当者: `CUSTOM_NOTION_USER_ID` を使う。未設定なら `notion-get-users` で自動取得。取得できない場合は省略
- 技術的な内容は書かない: ページ本文には技術的な内容を書かず、端的なメモにする。詳細は GitHub Issue に書く
- コメントは簡潔に: 1行の更新履歴形式で、コミットメッセージのように簡潔に書く
