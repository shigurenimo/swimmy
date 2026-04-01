---
name: docs
description: Structure and rules for .docs/ directory.
---

# ドキュメントルール

`.docs/`の運用ルールと検証基準を定義する。

各ファイルのフォーマットとルールは references/ を参照。

## references

- structure.md: ディレクトリ構造（単一製品・複数製品）
- index.md: index.md（旧product.md）のフォーマットとルール
- glossary.md: glossary.md のフォーマットとルール
- feedbacks.md: feedbacks/ のフォーマットとルール
- backlogs.md: backlogs/ のフォーマットとルール
- decisions.md: decisions/ (ADR) のフォーマットとルール
- snapshot.md: snapshot/ のファイル一覧とルール
- writing-rules.md: 記述ルール（書くもの・書かないもの）
- validation.md: 検証基準

## notes/

上記に分類できないメモ。自由形式。

## 開発サイクルでの使い方

### issueを受け取ったとき

- index.mdを読む → 製品の方向性を確認
- backlogs/index.mdを読む → 分析済みの課題を確認
- snapshot/features.mdを読む → 現状を把握
- 関連するADRを検索 → 過去の判断を確認

### 判断をしたとき

- decisions/に新しいADRを追加

### 顧客の声が来たとき

- voiceスキルでfeedbacks/に記録
- 重要な課題はbacklogスキルでbacklogs/に分析を追加
- index.mdの「解決する問題」を必要に応じて更新

### コードが大きく変わったとき

- docs-snapshotスキルでsnapshot/を再生成
