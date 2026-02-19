---
name: claude-issues
description: .claude/issues/ directory format and status management for local issue tracking
---

# Claude Issues フォーマット

`.claude/issues/` ディレクトリでローカル Issue を管理するためのフォーマット仕様。

## Issue ファイルのフォーマット

`.claude/issues/YYYY-MM-DD-{slug}.md` で管理する。FrontMatter でメタデータを記述する。

```markdown
---
status: pending
priority: high
created: 2026-02-15
---

## 概要

投稿の削除機能が未実装

## 対応内容

- [ ] 削除ボタンを追加
- [ ] 削除 API を実装
- [ ] テストを追加

## 備考

既存のコードベースと整合性を保つこと
```

## FrontMatter フィールド

必須フィールド:
- status: `pending` | `in_progress` | `completed` | `blocked`
- created: 作成日（YYYY-MM-DD）

任意フィールド:
- priority: `high` | `medium` | `low`

## ステータス

| ステータス | 意味 | 次のアクション |
|---|---|---|
| pending | 未着手 | ユーザーが承認するまで待つ |
| in_progress | 実装中 | コミット完了 → completed へ |
| completed | 完了 | - |
| blocked | 中止（人間の判断が必要） | ユーザーが対応方針を決める |

## 優先順位

`priority` フィールドで優先順位を指定する。同じ `priority` の場合は、作成日時順（ファイル名の日付プレフィックス）で処理する。

## ファイル命名規則

形式: `YYYY-MM-DD-{slug}.md`

- 日付: Issue 作成日（FrontMatter の `created` と一致）
- slug: 小文字とハイフンのみ。簡潔で分かりやすい名前

例:
- `2026-02-15-add-delete-button.md`
- `2026-02-14-fix-login-error.md`
- `2026-02-13-update-user-profile.md`
