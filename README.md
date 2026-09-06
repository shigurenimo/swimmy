# Swimmy

小さな匿名掲示板です。

開発時の規約は [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

- Next.js App Router
- Hono REST API
- Drizzle ORM + PostgreSQL
- Firebase Storage
- Bun

## 開発

必要な環境変数を `.env.local` に設定します。

```dotenv
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/swimmy
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

Firebase Emulatorを使う開発環境では、Firebaseの認証情報は不要です。

```bash
bun install
bun run dev
```

## コマンド

```bash
bun run lint       # vp lint による静的検査
bun run fmt        # vp fmt による整形
bun run check      # lint・整形確認・型検査
bun run test       # テスト
bun run build      # 本番ビルド
bun run studio     # Drizzle Studio
bun run emulators  # Firebase Emulator
```

## 構成

```text
app/        画面とNext.jsルート
interface/  REST APIと画面部品
service/    投稿・画像の処理
db/         Drizzle接続とスキーマ
```

Vite+ の設定は `vite.config.ts` に集約しています。fmt の書式指定は `semi: false` のみです。`vp lint` と `vp fmt` を直接実行することもできます。

掲示板は中央寄せ・最大幅 64rem の左右均等2列です。左に選択したスレッドの詳細を固定し、右の shadcn Tabs でホームのタイムラインとスレッド一覧を切り替えます。一覧はウィンドウでスクロールし、長い詳細は左側でもスクロールできます。サイト情報は最下部に表示します。
