# architecture.md

システム構成を書く。技術選定の理由は index.md の技術スタック節に書くので、ここには書かない。

## フォーマット

```md
# Architecture

{システム全体の構成図。mermaid flowchart}

## Runtime

{ランタイム環境}

## Rendering

{レンダリング方式}

## Data Fetching

{データ取得方式}

## Authentication

{認証方式}

## Storage

{データストア（DB、ストレージ、キャッシュ）}

## Styling

{スタイリング方式}

## Caching

{キャッシュ戦略}

## Error Tracking

{エラー監視・ログ収集}

## Analytics

{利用計測}
```

## ルール

- セクションは Runtime, Rendering, Data Fetching, Authentication, Storage, Styling, Caching, Error Tracking, Analytics など。製品で実際に使っているものだけ並べる
- 各セクション1〜3行。長文は書かない
- システム構成図は冒頭に mermaid flowchart で1枚
- 選定理由は書かない（index.md の技術スタックに書いてある）
- 外部システムと連携している場合、その連携自体（何をどうやりとりするか）は別ファイル `integrations.md` を立てて切り出すと整理しやすい。architecture.md は内部の構成に集中する
