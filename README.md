# Swimmy

小さな匿名掲示板です。

開発時の規約は [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

本番は [swimmy.io](https://swimmy.io/) です。Cloudflare Workers / D1 / R2 への移行は完了しました。全データの照合結果とバックアップは [移行記録](docs/cloudflare-migration.md) を参照してください。

- Next.js App Router + vinext / Cloudflare Workers
- Hono REST API
- Drizzle ORM + Cloudflare D1
- Cloudflare R2 + Images
- Bun

## 開発

ローカルの D1 / R2 を使います。Bun と Portless をインストールしてから起動します。

```bash
bun install
cp .dev.vars.example .dev.vars
bunx wrangler d1 migrations apply DB --local
portless
```

`portless.json` の名前を使い、`https://swimmy.localhost/` で表示します。Portless を使わない場合は `bun run dev` で `http://127.0.0.1:3000/` を開けます。新しいローカルDBは空です。実データのバックアップは Git に含めません。

`READ_ONLY=true` を設定すると書き込みに503を返します。現在はローカル・本番ともに `false` です。環境ごとの認証情報はGit管理せず、ローカル設定またはCloudflareのシークレットで管理します。

## コマンド

```bash
bun run lint       # vp lint による静的検査
bun run fmt        # vp fmt による整形
bun run check      # lint・整形確認・型検査
bun run test       # テスト
bun run build      # 本番ビルド
bun run types      # Workersバインディングの型生成
bun run studio     # D1用Drizzle Studio（CLOUDFLARE_API_TOKENが必要）
bun run start      # ビルド済みWorkerをローカル起動
```

公開用の `bun run deploy` は Cloudflare へ直接デプロイするコマンドです。main への Push では Cloudflare Builds が `bun run check && bun run test && bun run build` の成功後に `bunx wrangler deploy --config dist/server/wrangler.json` を実行します。非本番ブランチのビルドは無効です。`swimmy.io` と `www.swimmy.io` は同じ Worker に接続し、https://swimmy.nocker.workers.dev/ も同じ本番データを使います。Railway の自動デプロイ連携は解除済みです。

## 構成

```text
app/        画面とNext.jsルート
interface/  REST APIと画面部品
service/    投稿・画像の処理
db/         Drizzle接続とスキーマ
```

Vite+ の設定は `vite.config.ts` に集約しています。fmt の書式指定は `semi: false` のみです。`vp lint` と `vp fmt` を直接実行することもできます。

掲示板は中央寄せ・最大幅 64rem です。768px以上では左右均等2列で、左に選択したスレッドの詳細を固定し、右の shadcn Tabs でホームのタイムラインとスレッド一覧を切り替えます。一覧はウィンドウでスクロールし、長い詳細は左側でもスクロールできます。スマホでは一覧と詳細の片方だけを表示し、カードを開くと詳細へ、閉じると一覧へ戻ります。切り替え時は先頭から表示し、ウィンドウでスクロールします。サイト情報は最下部に表示します。

共通レイアウトが外側の余白を管理します。ヘッダーと内容の間は親の `gap-4` で確保し、sticky の背景が Card の外側の枠線を覆わないようにします。ヘッダーは左右・上、内容は左右・下のみ `4` を指定し、子の一覧・フォームには外側の padding を重ねません。

UI は shadcn の `base-lyra` を使います。Card・Button などの標準スタイルを利用し、呼び出し側で見た目を上書きしません。配置は外側の要素で調整し、Skeleton の表示寸法のみ指定します。
