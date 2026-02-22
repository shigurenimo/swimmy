---
name: docs-architecture-review
description: Review and evaluate repository architecture covering database, tests, API design, components, security, and dependencies.
---

# Review Architecture

リポジトリの構成を検出し、該当するレビュー項目をサブエージェントで並列実行する。

## 基本方針

メインは司令塔。実作業はサブエージェントで並列実行。

- 検出: リポジトリ構成を確認
- レビュー: 該当項目をサブエージェントで並列実行
- 保存: `.docs/reviews/` に書き込み

## ワークフロー

### Phase 1: リポジトリ構成の検出

以下を確認して、レビュー可能な項目を特定する。

```bash
# データベース
ls src/schema.ts src/db/ drizzle/ prisma/ 2>/dev/null

# テスト
ls tests/ src/**/*.test.ts vitest.config.ts playwright.config.ts 2>/dev/null

# API
ls src/api/ src/routes/api/ app/api/ 2>/dev/null

# コンポーネント
ls src/components/ 2>/dev/null

# 依存関係
ls package.json 2>/dev/null
```

### Phase 2: レビュー項目の判定

| 項目 | 検出条件 | reference |
|------|----------|-----------|
| database-schema | `src/schema.ts` または `prisma/schema.prisma` が存在 | database-schema.md |
| tests | `tests/` または `*.test.ts` が存在 | tests.md |
| api-design | `src/api/` が存在 | api-design.md |
| components | `src/components/` が存在 | components.md |
| security | 認証関連ファイルが存在 | security.md |
| dependencies | `package.json` が存在 | dependencies.md |

### Phase 3: サブエージェント並列実行

検出された各項目に対して、サブエージェント (general-purpose) を並列起動。

サブエージェントへの指示:

```
references/<item>.md のレビュー観点に従ってレビューを実行してください。

結果は以下の形式で .docs/reviews/<item>.md に保存してください:

---
updated-at: YYYY-MM-DD
---

# タイトル

## 概要
## 良い点
## 改善すべき点
## 推奨アクション
## 総評

脚注があれば末尾に追加。
```

重要: 全てのサブエージェントを**同時に**起動する。順次ではなく並列。

### Phase 4: 結果の集約

全サブエージェントの完了を待ち、結果をユーザーに報告。

```
レビュー完了:
- database-schema: ✓
- tests: ✓
- api-design: ✓
- ...

詳細は .docs/reviews/ を参照してください。
```

## 出力先

`.docs/reviews/`

## レビュー対象外の場合

該当ファイルが存在しない項目はスキップし、その旨を報告。

```
スキップ:
- database-schema: src/schema.ts が存在しません
```
