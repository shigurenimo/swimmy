---
name: gh-pr-template
description: Create or update GitHub pull request with proper format and required information.
---

# GitHub Pull Request

実装結果を記録する場所。計画や技術的な意思決定の記録は Issue に書く。PR には書かない。

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
