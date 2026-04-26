---
name: backlogs-index
description: "?"
user-invocable: true
disable-model-invocation: false
metadata:
  author: shigurenimo
  description: 指定した backlogs ディレクトリ配下の slug.md を全て読み込み、カテゴリ別ナラティブ形式の index.md を再生成するスキル。
  dev: false
---

# Backlogs Index

指定した backlogs ディレクトリ配下の slug.md を全て読み込み、カテゴリ別ナラティブの index.md を再生成する。

## 入力

```
/backlogs-index {backlogs-dir}
```

例: `/backlogs-index vault/products/jobantenna/products/jobantenna-partners/backlogs`

引数省略時は対話で対象ディレクトリを確認する。

## 手順

- 指定ディレクトリ配下の slug.md を全て読み込む（index.md は除く）
- 各 slug.md からテーマ名・背景・対応案・判断（開発する/未定/見送り）を抽出する
- 内容をもとにカテゴリを導出する。カテゴリは事前に固定せず、その product で自然に立ち上がる分類を使う
- カテゴリごとにナラティブ本文を書き起こす。判断（開発する/未定/見送り）は本文内に自然に織り込む
- 冒頭にサマリ段落を置く。全体件数・判断別の内訳・全体傾向を記述する
- 末尾に脚注を並べる。形式は `[^N]: {slug}.md ― {テーマ要約}（{判断}）`
- `backlogs/index.md` を上書き保存する

## フォーマット

```md
# バックログ

{冒頭サマリ段落。全体件数・判断別内訳・注目テーマ}

## {カテゴリ名}

{そのカテゴリの「開発する」テーマをナラティブで記述} [^1]。

{同カテゴリの「未定」テーマをナラティブで記述} [^2]。

## {カテゴリ名}

{本文} [^3]。

---

[^1]: {slug}.md ― {テーマ要約}（開発する）

[^2]: {slug}.md ― {テーマ要約}（未定）

[^3]: {slug}.md ― {テーマ要約}（見送り）
```

## ルール

- カテゴリ数は5から10程度を目安にする
- slug.md は編集しない。index.md のみ上書きする
- 脚注番号は本文の出現順で付ける
- 同一カテゴリ内では「開発する → 未定 → 見送り」の順で記述する
- 見送りでも削除せず、理由を簡潔に記述する
- 既存 index.md の構成は参照せず、slug.md から新規生成する
