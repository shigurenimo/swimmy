---
name: docs
description: Documentation management for .docs/ directory. Manages product specs, decisions, backlogs, and signals. Keeps docs in sync with code. Product thinking and design principles are in the software-design skill.
metadata:
  author: shigurenimo
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
