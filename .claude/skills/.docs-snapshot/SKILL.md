---
name: docs-snapshot
description: "Regenerate .docs/snapshot/ from codebase."
context: fork
---

# Snapshot再生成

`.docs/snapshot/`のファイルをコードから生成・更新する。

snapshot/は手で編集しない。常にコードから再生成できる。

## 基本方針

- ブランチの差分から影響範囲を特定し、関連する snapshot ファイルだけを再生成する
- サブエージェントで並列実行する
- 各ファイルは独立しているので全て同時に生成可能
- 対象の snapshot ファイルは丸ごと上書きする

## ワークフロー

### Phase 1: 対象の決定

以下の優先順位で対象を決定する:

- 「全て」と明示された場合: 全ファイルを更新する
- snapshot/ フォルダが空または存在しない場合: 全ファイルを更新する
- 上記以外: `git diff main...HEAD --name-only` でブランチの変更ファイルを取得し、影響する snapshot ファイルだけを更新する

変更ファイルと snapshot の対応:

| 変更の種類 | 更新する snapshot |
|---|---|
| ルート定義・ページ追加削除 | sitemap.md, user-flows.md |
| API・エンドポイント変更 | api-schema.md |
| コンポーネント追加削除 | components.md |
| スキーマ・モデル変更 | domain-model.md |
| 機能追加・変更・削除 | features.md, user-flows.md |
| インフラ・設定変更 | architecture.md |

判断に迷う場合は対象に含める。

### Phase 2: 並列生成

対象の snapshot ファイルをサブエージェントで並列生成する。
各ファイルのフォーマットは references/formats.md を参照。

### Phase 3: 検証

生成したファイルの整合性を確認する。
- features.md と user-flows.md の機能に抜け漏れがないか
- sitemap.md のルートが実際のルート定義と一致するか
- glossary.md の用語と一致しているか
