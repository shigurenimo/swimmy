---
name: docs-update
description: Update product specifications in .docs/ directory. Sync documentation with current codebase.
context: fork
---

# Update Docs

`.docs/` の仕様書をコードと同期して更新する。

ディレクトリ構造・記述ルール・検証基準は `docs` スキルに定義されている。

## 基本方針

メインは司令塔。実作業はサブエージェントで並列実行。

- 探索: サブエージェントで並列
- 更新: ファイルの数だけサブエージェントを並列実行
- 不明点: サブエージェントはメインに戻す → メインで Ask → 解決後サブエージェントで並走
- 最後: 仕様バグ・矛盾・食い違いをチェック

## ワークフロー

### Phase 0: 初期化（初回のみ）

`.docs/` ディレクトリが存在しない、または `product/` も `products/` もない場合は初回実行。

初回実行時:

1. AskUserQuestion で製品数を確認:
   - 「このリポジトリにはいくつの製品がありますか？」
   - 選択肢: 「1つ」「複数」
2. 回答に応じてディレクトリを作成:
   - 1つ → `.docs/product/`
   - 複数 → AskUserQuestion で製品名を確認 → `.docs/products/<name>/`

既存の `.docs/` がある場合:

- `product/` がある → 単一製品として継続
- `products/` がある → 複数製品として継続
- どちらもない → 初回実行と同様に確認

### Phase 0.5: 構造の検証（毎回実行）

`.docs/` のディレクトリ構造が `.docs` スキルの定義と一致しているか検証する。

検証対象:

- トップレベル: `architecture.md`（ファイル）、`glossary.md`、`product/` または `products/`
- 製品ディレクトリ: フラット構造（`features/`, `models/`, `services/` 等が直下にあること）

不一致を検出したら `git mv` で修正を試みる:

- `architecture/` がディレクトリ → `architecture/overview.md` を `architecture.md` にフラット化
- `product/` 配下にサブレイヤー（`domain/`, `application/`, `infrastructure/`, `interface/` など）がある → 中身を `product/` 直下に移動
- `.docs` スキルの定義にないディレクトリ → 内容を確認し、適切な場所に移動または `.claude/notes/` に退避

修正後、空ディレクトリを削除する。

### Phase 1: 変更対象の特定

```bash
git diff main...HEAD --name-only
```

`--full` オプションがある場合は全ファイルを対象にする。

### Phase 2: 探索 (並列)

サブエージェント (Explore) で変更されたコードを並列調査。

### Phase 3: 更新 (並列)

ファイルごとにサブエージェント (general-purpose) を並列起動。

サブエージェントへの指示:

```
.docs スキルの記述ルールに従ってファイルを更新してください。
不明点があればメインに戻してください。
```

不明点が返ってきたら:

1. メインで AskUserQuestion で質問
2. 解決したら再度サブエージェントで並走

### Phase 4: 整合性チェック

サブエージェントで仕様バグ・矛盾・食い違いをチェック。

問題があれば:

1. 該当ディレクトリに `issues/` を作成
2. Issue ファイルを作成

### Phase 5: Issue 解決

Issue ごとにユーザーに質問。

- 解決 → Issue ファイルを削除
- 未解決 → FrontMatter で `status: unresolved` をマーク

### Phase 6: CLAUDE.md の同期

CLAUDE.md に `## Docs` セクションがあるか確認。

なければ、以下の形式で追記:

```markdown
## Docs

`.docs/` に仕様書を配置。

- `glossary.md` - 用語の正式名称を確認してハルシネーションを回避
- `features/` - 機能の仕様を確認して実装漏れを防ぐ
- `integrations/` - 外部サービス連携の仕様を確認
- `stories/` - ユーザーストーリーを確認して要件を把握

`.docs/` 配下のディレクトリツリー
```

ルール:

- 見出しは必ず `## Docs` (固定)
- 実際の `.docs/` 構造をそのまま反映
- 抽象化せず、存在するディレクトリ・ファイルのみ記載

製品ディレクトリの判定:

- `product/` (単数) → 製品が1つ。`Product:` 記載は不要
- `products/` (複数) → 製品が複数。CLAUDE.md に `Product: <製品名>` を記載
- どちらもない → Phase 0 で確認済みのはず。確認されていなければ AskUserQuestion で尋ねる

複数製品の場合の CLAUDE.md 記載形式:

```markdown
## Docs

Product: website

`.docs/` に仕様書を配置。
```
