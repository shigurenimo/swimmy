---
name: docs
description: Define structure, writing rules, and validation criteria for product specifications in .docs/ directory. Use for spec review and consistency checks.
---

# 仕様書ルール

`.docs/` の仕様書に関するルールと検証基準を定義する。

## ディレクトリ構造

単一製品の場合:

```
.docs/
├── overview.md
├── architecture.md
├── glossary.md
├── notes/
└── product/
    ├── overview.md
    ├── features/
    └── ...
```

複数製品の場合:

```
.docs/
├── overview.md
├── architecture.md
├── glossary.md
├── notes/
└── products/
    ├── <product-a>/
    └── <product-b>/
```

製品ディレクトリの内容:

```
├── overview.md
├── architecture.md
├── operations.md
├── database.md
├── personas.md
├── actors.md
├── relationships.md
├── api.md
├── sitemap.md
├── stories/
├── models/
├── services/
├── policies/
├── integrations/
├── pages/
├── features/
└── issues/
```

## 記述ルール

### 基本方針

コードから分かることは資料に書かない。

資料の目的:

- 概要を整理して探索を助ける
- コードから読み取れない意図や背景を残す

書く内容:

- システム全体の構成・関係性
- 認証方式、データフローなどの設計概要
- コードに現れない制約や注意事項
- 技術選定の重要な理由（脚注で）

書かない内容:

- API エンドポイント一覧
- 関数・クラス・コンポーネントの一覧
- データ構造の詳細
- 実装の詳細手順
- コードを読めば分かる仕様

判断基準: 「コードを grep/read すれば分かるか?」 → Yes なら書かない

### architecture.md と operations.md の役割分担

architecture.md:

- 技術スタック（フレームワーク、ライブラリ）
- 状態管理、フォーム、スタイリングなどの構成
- 用途の簡潔な説明

operations.md:

- デプロイ手順・コマンド
- 監視方法・ツール
- アラート設定
- 障害対応・ロールバック

### features/ の記述ルール

非開発者が製品の機能を理解するための資料。

見出し1の下に説明文、その下に箇条書き。

禁止: 「目的」「概要」セクション、長い説明文、API エンドポイント、コンポーネント名、ルート構成、技術的な実装詳細

### api.md の記述ルール

書く内容: 認証方式、アーキテクチャ図、セキュリティヘッダー

禁止: エンドポイント一覧、詳細説明

### sitemap.md の記述ルール

フラットな箇条書き。セクション分け・テーブル形式禁止。

### services/ の記述ルール

非開発者がサービスでできることを理解するための資料。

見出し1の下に説明文、その下にユースケース(h3)を日本語で列挙。

禁止: 英語のユースケース名、技術的な制約・副作用、API・コンポーネント名

### 主観的表現の禁止

禁止: 思想・ビジョン、将来の展望、「〜だからこそ」

### 脚注の使用

コードから読み取れない意図・背景は脚注で残す。

ルール:

- 必ず番号を使用（`[^1]`, `[^2]`）
- 名前付き脚注は禁止
- 脚注定義はファイル末尾に `---` で区切って配置

### 図は必ず mermaid

flowchart, sequenceDiagram, erDiagram を使用。ASCII アート禁止。

## Issue ファイル

仕様の不一致や問題を記録するファイル。

### 配置

問題があるファイルと同じディレクトリに `issues/` を作成。

```
.docs/products/<product>/
├── features/
│   ├── <feature>.md
│   └── issues/
│       └── YYYY-MM-DD.<issue-summary>.md
```

### ファイル名

`YYYY-MM-DD.簡潔な説明.md`

例: `2026-01-19.api-endpoint-count.md`

### テンプレート

```markdown
---
status: unresolved
related: <related-file>.md
created-at: YYYY-MM-DD
---

# 不一致の内容

<file>.md では「Xと記載」されているが、コードでは Y と定義されている。

確認事項:

- 正しい値はどちらか
- 変更があったか、追加予定があるか
```

### ステータス

- `status: unresolved` - 未解決
- `status: resolved` - 解決済み（その後削除）

## 検証基準

仕様書を点検するときは以下の観点でチェックする。

### 構造の検証

- ディレクトリ構造がこのスキルの定義と一致しているか
- 不要なサブディレクトリ（`domain/`, `application/` など）がないか
- `architecture.md` がファイルであること（ディレクトリではない）

### 内容の検証

- コードと仕様の乖離がないか
- 実装済みだが仕様書に反映されていない機能がないか
- 仕様書にあるが未実装の機能がないか
- 記述ルールに違反していないか（コードで分かることが書かれていないか）
- 用語が `glossary.md` と一致しているか

### 整合性の検証

- 仕様書間で矛盾がないか
- features/ と services/ の関係が整合しているか
- models/ とデータベーススキーマが一致しているか
