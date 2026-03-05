---
name: docs-snapshot
description: "Regenerate .docs/snapshot/ from codebase."
context: fork
---

# Snapshot再生成

`.docs/snapshot/`のファイルをコードから生成・更新する。

snapshot/は手で編集しない。常にコードから再生成できる。

## 基本方針

- サブエージェントで並列実行する
- 各ファイルは独立しているので全て同時に生成可能
- 既存のsnapshot/ファイルは丸ごと上書きする。差分更新はしない

## ワークフロー

### Phase 1: 対象の決定

引数で指定されたファイルだけ更新する。指定がなければ全ファイルを更新する。

### Phase 2: 並列生成

各snapshot/ファイルをサブエージェントで並列生成する。
各ファイルのフォーマットはreferences/formats.mdを参照。

### Phase 3: 検証

生成したファイルの整合性を確認する。
- features.mdとuser-flows.mdの機能に抜け漏れがないか
- sitemap.mdのルートが実際のルート定義と一致するか
- glossary.mdの用語と一致しているか
