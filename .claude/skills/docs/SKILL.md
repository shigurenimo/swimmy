---
name: docs
description: .docs/ documentation management.
argument-hint: "[drift|links|next|features-sync] [scope]"
when_to_use: Writing or maintaining product docs under .docs/.
user-invocable: true
disable-model-invocation: false
metadata:
  type: reference
  description: .docs/ 配下の製品ドキュメント（仕様・意思決定・バックログ・顧客の声）を管理し、コードと矛盾がない状態を保つ。
  author: shigurenimo
  design: ナレッジグラフとして相互リンクした製品ドキュメントを管理し、コードとの矛盾検出や乖離更新を行う。設計判断と整合性維持の質が要となる。
  dev: true
  tags: [docs]
---

# ドキュメントルール

`.docs/` に製品ドキュメントを管理する。コードから読み取れない意思決定・声・計画を記録し、コードと矛盾がない状態を保つ。

## ディレクトリ構造

製品が1つの場合はフラットに並べる。

```
.docs/
  index.md                    製品の方向性、解決する問題
  value.md                    解決する痛みと提供価値の深掘り（必要なら）
  glossary.md                 用語集
  features.md                 機能一覧（小規模）
  features/                   機能ファイル分割（中〜大規模）
    index.md
    {slug}.md   または NNN_{日本語名}.md
  pages.md                    画面一覧（画面数30以上、必要なら）
  pages/                      画面ファイル分割（ルートファイル単位、必要なら）
  user-flows.md               ユーザー導線
  stories/                    業務ストーリー（ロール横断のユースケース、必要なら）
  sitemap.md                  URL一覧
  architecture.md             システム構成
  integrations.md             外部システム連携（必要なら）
  domain.md                   ドメインモデル（必要なら）
  models/                     ドメインモデル分割（テーブル数40以上、必要なら）
  roles-and-permissions.md    ロール権限（必要なら）
  milestones.md               リリース計画（必要なら）
  capabilities.md             ロール別できることサマリ（必要なら）
  page-capabilities.md        ロール × 画面の詳細できること（必要なら）
  manual/                     エンドユーザーマニュアル（必要なら）
  backlogs/                   プロダクトバックログ
  decisions/                  ADR（意思決定記録）
  signals/                    顧客と社内の声
  sources/                    一次情報（議事録・要件書・配布物）
  notes/                      自由メモ
  references/terms/           業界用語のアトミック定義
  drafts/                     検討中の草案
```

製品が複数ある場合は `products/{product-name}/` で分ける。`.docs/` 直下は全製品共通、`products/{product-name}/` は製品固有。

## 3種類の情報

人間が書く。コードから読み取れない意図・声・計画・価値。

- index.md, value.md, glossary.md, milestones.md, capabilities.md, manual/, stories/
- backlogs/, decisions/, signals/, notes/, references/terms/

コードから生成する。実装が正で、文書はその索引・要約。

- features（または features/）, user-flows.md, sitemap.md, architecture.md
- 必要に応じて integrations.md, domain.md, roles-and-permissions.md, api-schema.md, components.md
- 部分更新する。人間の追記コメントは残し、コードと矛盾する箇所だけ上書き。丸ごと再生成しない

一次情報として残す。決定の根拠。

- sources/ に議事録・要件書・配布物を日付キーで保存
- decisions/ や milestones.md, signals/ から `[[sources/minutes/YYYY-MM-DD-{topic}]]` で逆リンクし、判断の出所を辿れるようにする

## ナレッジグラフとリンク

ドキュメントは相互リンクで繋がったナレッジグラフとして育てる。1ファイル＝1ノード、`[[]]`＝エッジ。

原則。

- 専門用語・製品用語・機能名・他ドキュメントは本文に登場したら `[[]]` でリンクする。節（`##`）ごとに初出1回が目安
- wikiリンク `[[slug]]` または `[[path/file|表示名]]` を使う。Markdown リンク `[text](path)` は使わない
- 表記が揺れる語は `[[正式名|本文の表記]]`（例: `[[単位数|単位]]`、`[[pl|PL]]`）
- 未解決リンクは「次に書くべきノード」のしるしになる
- 見出し・コードブロック・mermaid・frontmatter の中にはリンクを張らない
- 孤立ノードを作らない。新ファイルは関連ノードか索引（glossary.md など）から必ず1本繋ぐ

## 専門知識のノード化

製品の外にある専門知識（業界用語・制度・会計・技術）は `references/terms/{用語}.md` に1用語1ファイルで定義する。フォーマットとルールは [glossary.md](references/glossary.md) を参照。

棲み分け。

- references/terms/ = 製品の外にある専門知識のアトミック定義（グラフのノード）
- notes/ = 長文の解説・深掘り（terms から文中でリンクする先）。一時的な棚卸し・調査メモ（`ephemeral: true`）も置く。詳細は [notes.md](references/notes.md)
- glossary.md = 用語の索引、および機能名・製品固有用語の定義
- features/ = 製品の機能

## 矛盾の検出と更新

ドキュメントは古くなる。定期的にサブエージェントで矛盾を検出し、ユーザーと一緒に何が正しいかを確認して更新する。

- index.md の方向性が現状のコードと合っているか
- features がコードの実態と一致しているか
- backlogs に完了済みの項目が残っていないか
- decisions の内容が現在の実装と矛盾していないか
- milestones の日付が現状計画と合っているか
- roles-and-permissions が `requireRole()` の宣言と一致しているか

コードと文書が矛盾する場合、コードを正とする。ただし人間に確認してから更新する。

## 各ファイルのフォーマット

人間が書く。

- [index.md](references/index.md)
- [value.md](references/value.md)
- [glossary.md](references/glossary.md)
- [milestones.md](references/milestones.md)
- [capabilities.md](references/capabilities.md)
- [page-capabilities.md](references/page-capabilities.md)
- [stories.md](references/stories.md)
- [manual.md](references/manual.md)
- [backlogs.md](references/backlogs.md)
- [decisions.md](references/decisions.md)
- [signals.md](references/signals.md)
- [sources.md](references/sources.md)

コードから生成する。

- [features.md](references/features.md)
- [pages.md](references/pages.md)
- [sitemap.md](references/sitemap.md)
- [architecture.md](references/architecture.md)
- [integrations.md](references/integrations.md)
- [domain.md](references/domain.md)
- [roles-and-permissions.md](references/roles-and-permissions.md)
- [api-schema.md](references/api-schema.md)
- [components.md](references/components.md)

共通ルール。

- [writing-rules.md](references/writing-rules.md): 記述ルール
- [human-claude-zone.md](references/human-claude-zone.md): signals/backlogs の人間ゾーンと Claude ゾーンの境界
- [validation.md](references/validation.md): 検証基準

## サブコマンド

`/docs {sub}` でドキュメント運用のタスクを呼び分ける。各サブコマンドは `commands/{sub}.md` に詳細を書く。

- [next](commands/next.md): コードベース全体を多レンズで探索し、未捕捉タスクを `tasks.md` に追記する。Workflow ファンアウトで網羅性を担保する。重い処理（300+ agent 規模）。
- [drift](commands/drift.md): 仕様書／README と実装の乖離を検出する。「実装済」記述と実コードの突合、テーブル数・画面数・ロール権限の食い違い。
- [links](commands/links.md): `[[wikilink]]` を解決して未定義リンク・孤児ページ・循環参照を検出する。

将来候補（必要になったら追加）。

- lint — 書式チェック（Markdown ルール・frontmatter 必須項目・命名規則）
- index — features/signals/backlogs の index.md 再生成
- orphan — どこからも参照されていない .md の検出
- status — 実装ステータス記号と実装の自動突合
- sync — backlog/signal を tasks.md へ昇格、tasks.md の判断済を docs 本文へ吸収
- glossary — 用語の整合（定義漏れ・揺れ）
- publish — docs→HTML 同期
- review — 6 読者導線・3 クリック到達・説明の薄さの読み物検査

## 開発サイクルでの使い方

software-design スキルを参照。
