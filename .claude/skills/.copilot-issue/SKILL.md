---
name: copilot-issue
description: Implement issues from planning to completion
argument-hint: "[use-worktree=true|false] worktreeを使うかどうか（並走時はtrue、1件ずつの対話時はfalse）"
---

# Issue 実装

Issue を受け取り、計画・実装・コミットまで完結する。完了後に成果物を報告する。

## 引数

- `use-worktree=true`: worktree を作成して独立したブランチで作業する（並走時・デフォルト）
- `use-worktree=false`: 現在のリポジトリのブランチで直接作業する（対話モードで1件ずつ進める時）

## 必須スキル

- `superpowers` - 計画・worktree・TDD・実装・検証のワークフロー全体
- `pr-review-toolkit` - 実装後のコード簡潔化
- `commit-commands` - コミット・クリーンアップ
- `security-review` - 実装後のセキュリティレビュー

## オプション

- `frontend-design` - フロントエンド UI 実装時
- `webapp-testing` - UI/UX の動作確認時

## プロセス

`docs` スキルで仕様書を理解 → 計画を作成して報告・承認待ち → （use-worktree=true の場合）worktree 作成 → 実装 → コード簡潔化 → セキュリティレビュー → 検証・動作確認 → コミット → 成果物を報告 → （use-worktree=true の場合）クリーンアップ指示を受けたら worktree を削除

## 成果物

- ブランチ名・最新コミットハッシュ
- 技術的検証結果（型チェック・テスト・ビルド）
- 動作確認結果
- 変更内容（ユーザー目線）
- 確認してほしいこと
