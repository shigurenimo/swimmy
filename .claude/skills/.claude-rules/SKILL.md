---
name: claude-rules
description: "Extract and record coding patterns, conventions, and design rules from codebase into local rule files. Called by other skills or explicitly via command."
disable-model-invocation: true
---

# Infer Code Rules

コードベースから設計パターン・規約を抽出し、ローカルルールとして記録する。

このスキルは自動トリガーされない。別のスキルから呼び出すか、コマンドで明示的に実行する。

## ルールファイルの配置

`.claude/rules/local.{category}.md`

例:

- `local.react.components.md` - コンポーネントパターン
- `local.react.routes.md` - ルートパターン
- `local.ui-design.md` - UIデザインパターン
- `local.tests.md` - テストパターン

`local.` プレフィックスは、このプロジェクト固有のルールであることを示す。

## 実行手順

### ステップ1: 既存ルールの確認

まず既存のルールファイルを全て読み込み、内容を把握する。

```bash
ls .claude/rules/
```

全ファイルの内容を Read で確認し、既存ルールのリストを作成する。

### ステップ2: コードベースの探索

対象ディレクトリを探索してパターンを収集する。

探索対象の例:

- `app/routes/` - ルートパターン
- `app/components/` - コンポーネントパターン
- `app/hooks/` - フックパターン

### ステップ3: パターンの抽出

探索の観点:

- コンポーネント構造
- UIライブラリの使い方
- レイアウトパターン
- フォーム構造
- ローディング/エラー状態

### ステップ4: 既存ルールとの照合

抽出したパターンを既存ルールと比較し、重複を除外する。

重複の判定基準:

- 同じ概念を説明している (例: 「type を使う」「interface を使わない」)
- 同じ命名規則を説明している (例: 「kebab-case」「ハイフン区切り」)
- 同じファイル構造を説明している (例: 「1ファイル1関数」「1ファイル1コンポーネント」)

対応方法:

- 重複する場合 → 追加しない
- 既存ルールを具体化・補足する場合 → 既存ルールへの参照を記載
- 矛盾がある場合 → AskUserQuestion でユーザーに確認

### ステップ5: ルールファイルの作成・更新

ユーザーの承認後、ルールファイルを作成または更新する。

## ルールファイルのフォーマット

```markdown
---
paths: "app/components/**/*.tsx"
---

# Local Component Rules

## セクション名

説明文。

コード例 (必要な場合のみ)。
```

`paths` フロントマターで適用範囲を指定する。

## 注意事項

- 既存ルールと矛盾する場合は必ずユーザーに確認
- コード例は簡潔に
- 「なぜそうするか」の理由も記録
- ルール追加の判断基準は `.workflow.md` の「ルール追加の提案」に従う

## local ルールに追加すべき内容

- プロジェクト固有のパターン (例: useHref の使い方、pageMetaFunction)
- 既存ルールにない具体的な実装パターン (例: フックの初期化順序)
- フレームワーク固有の規約 (例: React Router の loader パターン)

## local ルールに追加すべきでない内容

- 既存のルールファイルで既にカバーされている一般的な規約
- 言語レベルの規約 (type vs interface, 命名規則, ファイル構造)
- 一般的なプログラミング原則 (SOLID, 関数型プログラミング)
