# 製品パターン

製品の種類によって必要なファイルが異なる。

| パターン | 説明 | interface/ の構成 |
|---------|------|------------------|
| Web + API | フロントエンド + バックエンド | 全て必要 |
| API のみ | バックエンド API サーバ | api.md, features/ のみ |
| Web のみ | 静的サイト、SPA | sitemap.md, features/, pages/ のみ |

## Web + API

一般的な Web アプリケーション。

必要なファイル:

- sitemap.md
- api.md
- features/
- pages/

## API のみ

マイクロサービス、BFF など。

必要なファイル:

- api.md
- features/

不要なファイル:

- sitemap.md
- pages/

## Web のみ

LP、静的サイト、SPA など。

必要なファイル:

- sitemap.md
- features/
- pages/

不要なファイル:

- api.md
