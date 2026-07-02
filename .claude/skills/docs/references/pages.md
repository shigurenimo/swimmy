# pages

ルートファイル単位の画面ドキュメント。`features/` が「機能（責務）」で並ぶのに対し、`pages/` は「コードのルートファイル」と 1:1 で並ぶ索引。

## features と pages の棲み分け

- features: 1 機能 = 1 ファイル。複数画面に跨る場合もある。業務責務で分類
- pages: 1 ルートファイル = 1 ファイル。URL・コードファイル名と 1:1。ファイル名はコードの `routes/*.tsx`（または相当するルートファイル）と対応

両方持つと、機能視点（features）と画面視点（pages）の二軸で行き来できる。コードを正のソースとして自動更新する。

## いつ作るか

- 画面数が 30 以上ある
- 1 機能が複数 URL に分割されている（例: 一覧・詳細・新規作成）
- ルートファイル名から機能名への対応が一目で必要

画面数が少ない、または features と画面が 1:1 ならば features だけで十分。

## ディレクトリ構造

```
.docs/
  pages.md              ルート一覧（索引）
  pages/
    {route-file}.md     1 ルートファイル = 1 ファイル
    relations.md        画面遷移図（必要なら）
```

ファイル名はコードのルートファイル名に揃える（例: `residents.$resident.assessments.index.md`）。

## pages.md（索引）

```md
# ページ一覧

{製品名} の全画面ページをルートファイル名で索引する。ファイル名はコードの `{routes パス}/*.tsx` と対応。

関係図は [[pages/relations|relations]] を参照。

## {ロール名}

- [[pages/{route-file}|{route-file}]] `{URL}` — [[{features の機能名}]]
- [[pages/{route-file}|{route-file}]] `{URL}` — {機能の 1 行説明}
```

ルール。

- ロール別または責務別にセクションを分ける
- エントリは `[[pages/{route-file}|{route-file}]] \`{URL}\` — {説明}` 形式
- 説明側に該当する features へのリンクを `[[]]` で張る
- ファイル名はバッククォートで囲む（コードのファイル名であることを示す）

## pages/{route-file}.md

frontmatter。

```yaml
---
name: 日本語の画面名
route: {route-file}
url: {URL パターン}
roles: [{role_key}, {role_key}]
features: [F{NNN}, F{NNN}]
wireframe: {ワイヤーフレーム/スライドの相対パス}
status: {実装済 / 一部 / モック / 未着手}
---
```

フィールド。

- `name` / `route` / `url`: 必須。`route` はコードのルートファイル名と一致
- `roles`: その画面にアクセス可能なロール（複数可）
- `features`: 関連機能の id を配列で持つ。pages → features の逆引き索引
- `wireframe`: ワイヤーフレーム・スライド・モックの相対パス（あれば）
- `status`: 実装ステータス（features.md の凡例と揃える）

本文。

```md
# {画面名}

{画面の 1〜2 行説明。フェーズや状態の注記もここに}

## できること

- {ユーザーが何をできるか}
- {ユーザーが何をできるか}

## 関連

- 上位: [[pages/{親 route}|{親画面名}]]
- 下位: [[pages/{子 route}|{子画面名}]]
```

ルール。

- 「何ができるか」は features と同じ粒度
- 機能本体の説明は features 側に置き、ここからリンクする（重複させない）
- 画面固有の事情（モーダルの挙動、印刷レイアウト、スマホ表示の差分）はここに書く

## 維持の仕方

- ルートファイルが追加・削除されたら `pages.md` と `pages/` を追従
- ルートファイル名を変更したら、両側のファイル名と wikiリンクを揃える
- 全ファイル再生成はしない。差分追従
