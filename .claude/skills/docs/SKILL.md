---
name: docs
description: .docs/ documentation management.
when_to_use: Writing or maintaining product docs under .docs/.
user-invocable: true
disable-model-invocation: false
metadata:
  description: .docs/ 配下の製品ドキュメント（仕様・意思決定・バックログ・顧客の声）を管理し、コードと矛盾がない状態を保つ。
  author: shigurenimo
  dev: true
  tags: [docs]
---

# ドキュメントルール

各アプリの `{app}/.docs/` に製品ドキュメントを管理する。コードから読み取れない意思決定やバックログを記録し、コードと矛盾がない状態を保つ。

## ディレクトリ構造

製品が1つの場合はフラットに並べる:

```
.docs/
  index.md           # 製品の方向性、解決する問題
  glossary.md        # 用語集
  features.md        # 機能一覧と現在の状態
  user-flows.md      # ユーザー導線
  backlogs/          # プロダクトバックログ
  decisions/         # ADR（意思決定記録）
  signals/           # 顧客と社内の声
  notes/             # 自由メモ
```

製品が複数ある場合は `products/` で分ける:

```
.docs/
  index.md           # 全製品に共通する方向性、組織のミッション等
  glossary.md        # 全製品で共有する用語集
  products/
    {product-name}/
      index.md       # この製品の方向性、解決する問題
      glossary.md    # この製品固有の用語集
      features.md    # 機能一覧と現在の状態
      user-flows.md  # ユーザー導線
      backlogs/      # プロダクトバックログ
      decisions/     # ADR（意思決定記録）
      feedbacks/     # ユーザーの声
      notes/         # 自由メモ
```

`.docs/` 直下のファイルは全製品に共通する内容を書く。製品固有の内容は `products/{product-name}/` に書く。

## 2種類の情報

人間が書くもの（コードから読み取れない）:

- index.md: 製品の方向性、ペルソナ、ジョブ、意思決定プロセス（software-design スキルの顧客理解をここに記録する）
- glossary.md, backlogs/, decisions/, signals/, notes/
- なぜそうしたか、何を作るべきか、ユーザーの声

コードから生成するもの:

- features.md, user-flows.md
- 必要に応じて architecture.md, sitemap.md, domain-model.md も追加

コードから生成するファイルは部分的に更新する。人間が追記したコメントや補足は残し、コードと矛盾する部分だけ上書きする。丸ごと再生成しない。

## コード生成ファイルのフォーマット

features.md: 機能単位で「何ができるか」を書く。実装詳細は書かない。
user-flows.md: ユーザー種別ごとに番号付きステップで導線を書く。
詳細は [formats.md](references/formats.md) を参照。

## ナレッジグラフとリンク

ドキュメントは孤立した文書の集まりではなく、相互リンクで繋がったナレッジグラフとして育てる。Obsidian では「1ファイル＝1ノード」「`[[]]`＝エッジ」でグラフが描かれる。リンクは積極的に張る。

原則:

- 専門用語・製品用語・機能名・他ドキュメントは、本文に登場したら `[[]]` でリンクする。リンクは「節（`##`）ごとに初出1回」を目安にし、読みやすさを保つ（同じ語を1段落で何度も張らない）。
- リンクは Obsidian の wikiリンク `[[slug]]` または `[[path/file|表示名]]` を使う。Markdown リンク `[text](path)` は使わない。
- 表記が揺れる語は `[[正式名|本文の表記]]` で表示名を当てる（例: `[[単位数|単位]]`、`[[pl|PL]]`）。
- まだ定義ファイルが無い語でも先に `[[]]` を張ってよい。未解決リンクは「次に書くべきノード」のしるしになる。
- 見出し・コードブロック・mermaid・frontmatter の中にはリンクを張らない。

孤立ノード（どこからもリンクされない／どこへもリンクしないファイル）を作らない。新しいファイルを足したら、関連ノードと用語索引（glossary.md など）から必ず1本は繋ぐ。

## 専門知識のノード化（references/terms/）

製品の外にある専門知識（業界用語・制度・会計・技術の用語）は、`references/terms/{用語}.md` に1用語1ファイルのアトミックなノードとして定義する。これがグラフの土台になる。

棲み分け:

- references/terms/ = 製品の外にある専門知識のアトミック定義（グラフのノード）
- notes/ = 長文の解説・深掘り（references/terms/ から文中でリンクされる先）
- glossary.md = 用語の索引、および機能名・製品固有用語の定義（機能詳細との二重記述を避けるため、製品の用語はここに留め、細かく書かない）
- features/ = 製品の機能

ノードのフォーマット:

```
---
term: 用語
reading: よみがな
aliases: [別名]
category: カテゴリ
---

# 用語（正式名）

2〜6 行の定義。素人にも分かる言葉で。関連語や深掘り先の notes は、定義文の中に自然に `[[]]` で埋め込む。
```

ルール:

- 1ファイル1用語。定義は短く（2〜6行）。
- リンクは定義文の中に自然に `[[]]` で埋め込む。「関連」「詳細」のようなリンク専用の節やリストは作らない（リストの維持がメンテ負担になるため）。深掘り先の `notes/` も文中でリンクする。
- `references/terms/` に index.md は作らない（索引は glossary.md が兼ねる）。
- 製品固有の挙動・機能はノードにせず、該当機能 `[[features/...|表示名]]` へリンクする。
- ファイル名に大文字を使わない。英字の用語は小文字とハイフンだけにする（例: `pl.md`、`kpi.md`、`spo2.md`）。frontmatter の `term:` と本文見出しには `PL`・`SpO2` のような正式な大文字表記を残し、リンクは `[[pl|PL]]` のように表示名を当てる。日本語の用語は日本語ファイル名でよい。

## 矛盾の検出と更新

ドキュメントは古くなる。定期的にサブエージェントで矛盾を検出し、ユーザーと一緒に何が正しいかを確認して更新する:

- index.md の方向性が現状のコードと合っているか
- features.md がコードの実態と一致しているか
- backlogs に完了済みの項目が残っていないか
- decisions の内容が現在の実装と矛盾していないか

コードと文書が矛盾する場合、コードを正とする。ただし人間に確認してから更新する。

## 各ファイルのフォーマット

- [index.md](references/index.md): 製品の方向性と解決する問題
- [glossary.md](references/glossary.md): 用語集
- [backlogs.md](references/backlogs.md): プロダクトバックログ
- [decisions.md](references/decisions.md): ADR（意思決定記録）
- [signals.md](references/signals.md): 顧客と社内の声
- [formats.md](references/formats.md): コード生成ファイル（features.md, user-flows.md 等）のフォーマット
- [writing-rules.md](references/writing-rules.md): 記述ルール
- [validation.md](references/validation.md): 検証基準

## 開発サイクルでの使い方

software-design スキルを参照。
