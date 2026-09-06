# Cloudflare 移行の記録

2026-09-07（JST）に [swimmy.io](https://swimmy.io/) と [www.swimmy.io](https://www.swimmy.io/) を Cloudflare Workers / D1 / R2 へ切り替え、書き込みを開始しました。関連: [#29](https://github.com/shigurenimo/swimmy/issues/29)、[#31](https://github.com/shigurenimo/swimmy/issues/31)。請求先の紐付けと main への Push はユーザーの承認に基づいて実施しました。

## 移行結果

PostgreSQL の全11アプリケーションテーブル・85列を D1 `swimmy` に移しました。旧DBの書き込みを停止した後、2026-09-06 17:24:35 UTC に最終スナップショットを取得しました。D1から読み戻した全行と内容ハッシュが一致し、外部キー違反0件、整合性検査は `ok` でした。先行取り込み時点から変更がなかったため、同じ内容の再インポートは行っていません。

| テーブル                                                                          |   行数 |
| --------------------------------------------------------------------------------- | -----: |
| posts                                                                             | 31,253 |
| reactions                                                                         | 28,910 |
| users                                                                             |     67 |
| sessions                                                                          |      8 |
| _user_reactions、bookmarks、friendships、likes、notifications、references、tokens |    各0 |
| 合計                                                                              | 60,238 |

これは切り替え前の件数です。以降の新しい投稿はD1に保存されます。

Firebase Storage / Google Cloud Storageから、未参照画像も含む全1,904件・2,446,191,354 bytesをR2 `swimmy-images` へ移しました。旧世代・ソフト削除済みは0件でした。元キー、全バイト列、配信メタデータを保持し、R2から全件を読み戻してサイズ・SHA-256・キー集合・メタデータの一致を確認しました。Storageの書き込み停止後にも全世代・CRC32C・MD5・サイズ・メタデータ世代が変わっていないことを照合しました。

DBが参照する固有画像キー1,191件のうち、1件は移行元にも存在しない不正なキーです（[Issue #36](https://github.com/shigurenimo/swimmy/issues/36)）。推測でキーを補正せず元データを保持しています。残る1,190件を含む全実画像は移行済みです。

現行コードで使わないデータも含めて保全しました。旧リソースは削除していません。

## 本番と検証

Worker は `swimmy`、D1 は `swimmy`、画像用R2は `swimmy-images` です。リソースIDと両ドメインはルートの `wrangler.jsonc` に記録し、`READ_ONLY=false` で稼働しています。workers.dev のURLも同じ本番データを使います。

- Cloudflare上で画像アップロード・投稿・返信・リアクションの作成と取得に成功しました。検証用データは削除し、D1全行の内容ハッシュを再照合しました。
- ホームとスレッド一覧のページング、最大59返信のスレッドを確認し、ID・順序の欠落と重複は0件でした。最大124,416 bytesの長文本文も一致しました。
- 両本番ドメインでHTTPS、画面、一覧API、過去画像、約15 MBのGIFからの画像変換が200でした。空投稿は400で拒否され、書き込み停止の503ではないことも確認しました。
- Chromeで本番画面とカードからスレッド詳細を開く操作を確認しました。PC・スマホのレイアウトは切り替え前にも検証済みです。
- `bun run check`、46件のテスト、`bun run build`、Wranglerのdry runが成功しました。

Railwayへの自動デプロイ連携を解除し、Cloudflare Buildsを `shigurenimo/swimmy` のmainに接続しました。Pushで `bun run check && bun run test && bun run build` を実行後、`bunx wrangler deploy --config dist/server/wrangler.json` で公開します。Bunは1.3.14、Node.jsは24、非本番ブランチのビルドは無効です。

旧Railway向けCNAME2件を取り除き、Workers Custom Domainsとして両ドメインを登録しました。既存TXT3件は保持しています。切り替え時のWorkerバージョンは `6e6589e9-64fc-4ae0-8bf7-17b19e097418` です。

## バックアップと旧環境

移行元のDBと画像、最終スナップショット、全件照合の記録は非公開で保管しています。復元用バックアップはアプリから参照できないストレージにも保存し、読み戻して内容の一致を確認しました。保管場所と認証・復元に必要な情報は公開文書に記載しません。

旧環境への書き込みは停止し、新しい投稿と画像はCloudflareに保存されます。切り戻し時は新環境の書き込みを停止し、切り替え後のデータを退避・反映してから配信先を戻します。DNSだけを戻すと新規データが失われるため、実際の復元操作には非公開の運用記録を使います。

## PostgreSQL → D1 の変換

| PostgreSQL     | D1 / SQLite       | 保持する内容                        |
| -------------- | ----------------- | ----------------------------------- |
| `text`         | `TEXT`            | 空文字、改行、絵文字、引用符        |
| `text[]`       | JSON形式の `TEXT` | 配列順序、`NULL` と空配列の区別     |
| `timestamp(3)` | `INTEGER`         | 格納日時をUTCとしてミリ秒単位で保存 |
| `boolean`      | `INTEGER` + CHECK | 0 / 1 と nullable の区別            |
| 列挙型         | `TEXT` + CHECK    | 値と許可値の制約                    |
| `integer`      | `INTEGER`         | 整数値                              |

主キー、ユニークインデックス、外部キーの削除・更新アクションは実DBから取得します。コード側の `db/schema.ts` も実DBの制約・インデックスに合わせて SQLite 定義へ移植しました（[Issue #30](https://github.com/shigurenimo/swimmy/issues/30)）。推測で制約を落としません。未対応の型・式・ビュー・トリガーなどを検出した場合はスクリプトを失敗させます。

1件の長文投稿が [D1 のSQL文上限100 KB](https://developers.cloudflare.com/d1/platform/limits/) を超えたため、補助テーブルを使ってUnicodeの境界で分割し、元の本文へ結合してから保存します。取り込み完了時に補助テーブルを削除します。本文を短縮する処理はありません。最大DBサイズは無料500 MB / 有料10 GBなので、現時点の容量は範囲内です。リクエスト数などの運用料金は別途確認します。

### ローカルでの再実行

Bun と Wrangler を使います。`DATABASE_URL` は既存の `.env.local` から読み込まれます。接続文字列をコマンドやログに表示しないでください。保存先にはリポジトリ外の新しいディレクトリを指定します。

```bash
export SWIMMY_BACKUP_ROOT="/absolute/path/outside/repository/new-run"
umask 077
mkdir "$SWIMMY_BACKUP_ROOT"

bun scripts/migration/postgres-snapshot.ts "$SWIMMY_BACKUP_ROOT/postgres"
bun scripts/migration/prepare-d1.ts \
  "$SWIMMY_BACKUP_ROOT/postgres/postgres.json" "$SWIMMY_BACKUP_ROOT/d1"

wrangler d1 execute DB --local \
  --config scripts/migration/wrangler.jsonc \
  --persist-to "$SWIMMY_BACKUP_ROOT/d1-state" \
  --file "$SWIMMY_BACKUP_ROOT/d1/schema.sql" --json \
  > "$SWIMMY_BACKUP_ROOT/schema-import.json"

wrangler d1 execute DB --local \
  --config scripts/migration/wrangler.jsonc \
  --persist-to "$SWIMMY_BACKUP_ROOT/d1-state" \
  --file "$SWIMMY_BACKUP_ROOT/d1/data.sql" --json \
  > "$SWIMMY_BACKUP_ROOT/data-import.json"

SWIMMY_LOCAL_DB="$(rg --files "$SWIMMY_BACKUP_ROOT/d1-state" | rg '/[0-9a-f]+\.sqlite$')"
bun scripts/migration/verify-d1.ts \
  "$SWIMMY_LOCAL_DB" "$SWIMMY_BACKUP_ROOT/d1/verification.json"
```

検証時は同じローカルD1を使う開発サーバーを停止します。検証スクリプトはSQLiteのWAL管理ファイル作成を許可しますが、SQLの書き込みは禁止します。照合は行順序に依存せず、全列と重複行の数を含めて比較します。

同梱の Wrangler 設定はローカル専用の仮IDです。本番IDを記入したり、その設定でデプロイしたりしません。SQLは [D1のインポート仕様](https://developers.cloudflare.com/d1/best-practices/import-export-data/) に従い、`BEGIN` / `COMMIT` を含めていません。リモート取り込みは複数トランザクションに分かれるため、テーブルと自己参照する行を親から子へ並べています。外部キーの遅延評価だけには依存しません。途中で失敗した場合は、既存DBへ続きを流さず、新しい空の移行先でやり直します。ルートの `wrangler.jsonc` は実リソース用であり、移行用のローカル設定とは別です。

## 画像の全件保存と R2

`scripts/migration/backup-storage.ts` で実バケットの全件保存を完了しました。既存のサービスアカウント、または Application Default Credentials が必要です。必要な読み取り権限は `storage.buckets.get`、`storage.objects.list`、`storage.objects.get`。今回はGoogle Cloud CLIの通常のユーザー認証によるADCを使い、新しいサービスアカウント鍵の発行やIAM変更は実施していません。

```bash
# 既存の読み取り用資格情報を端末側で設定してから実行
bun scripts/migration/backup-storage.ts "$SWIMMY_BACKUP_ROOT/storage"
```

スクリプトは全ページ・全オブジェクト世代を列挙し、世代番号を指定して元のバイト列を保存します。キー・世代・メタデータは `inventory.json`、実体はハッシュ名のローカルファイルに記録します。CRC32C、サイズ、存在する場合はMD5で検査し、SHA-256を計算します。全件成功した場合だけ `manifest.json` を作ります。途中失敗時は保存済みファイルを残し、新しい保存先で再実行します。ソフト削除済みオブジェクトの復元は別途必要です。

画像移行の完了条件:

1. ソースの全件列挙と保存が完了し、バケット全体の件数・容量を確定する。
2. `image-keys.json` の全キーが現行オブジェクトに存在するか照合する。欠落を見つけたら移行前からの問題としてIssueに記録する。
3. 未参照画像も含む全現行オブジェクトを、元のキーのまま専用R2バケットへ保存する。旧世代も捨てず、別のアーカイブとして保持する。R2の現行キーに旧世代を上書きしない。
4. Content-Type、Cache-Control、Content-Disposition、Content-Encodingなど、配信に必要なメタデータを保持する。Firebaseのダウンロードトークンを公開メタデータとして転送しない。
5. R2から全件を読み戻し、キー集合・サイズ・SHA-256をローカルのマニフェストと比較する。移行元と移行先のETagだけで同一性を判断しない。
6. 既存の `/api/images/:id` で過去の画像、複数添付、プロフィール画像、存在しないIDを確認する。

転送には `scripts/migration/transfer-storage.ts` を使います。書き込み停止中の専用R2を対象に実行し、移行元と移行先への書き込みを再開する前に照合を完了します。

```bash
bun scripts/migration/transfer-storage.ts \
  "$SWIMMY_BACKUP_ROOT/storage/manifest.json" swimmy-images \
  "$SWIMMY_BACKUP_ROOT/r2-verified"
```

転送前に全ローカルファイルのSHA-256とサイズを検査します。転送と読み戻しは16件ずつ実行します。現行画像は元キー、旧世代は `_migration_archive/<元バケット>/<キーと世代から生成したハッシュ>` に保存し、衝突があれば中止します。`wrangler r2 object put/get --remote` で転送・全件読み戻しを行い、[R2の一覧API](https://developers.cloudflare.com/api/resources/r2/subresources/buckets/subresources/objects/methods/list/)でページを最後まで取得してキー集合・サイズ・配信メタデータを照合します。認証は既存のWranglerを使い、トークンはログやファイルに残しません。マニフェスト外の移行先オブジェクトは削除せず、処理を中止します。

全件成功時だけ新しい検証保存先に `verification.json` を作ります。失敗時は部分転送済みの画像を残すため、原因を直して別の検証保存先で再実行します。途中結果だけでは完了と判断しません。現行・旧世代の合成画像で事前検証し、実Firebase画像1,904件も全件照合を完了しました。

## アプリ側の移植

Next.js App Router / Hono の既存URLを維持して vinext + Cloudflare Vite plugin に移植しました。[Cloudflare の Next.js ガイド](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/) に沿った構成です。vinext はベータ版です。本番切り替え前にCloudflare上で画面・読み書き・画像変換を検証しました。

- DB はリクエストごとの D1 バインディングと `drizzle-orm/d1` を使います。日時は `timestamp_ms`、配列は JSON、真偽値は boolean モードです。
- 返信作成は [D1 batch](https://developers.cloudflare.com/d1/worker-api/d1-database/) の条件付き INSERT と親の件数更新で処理します。途中失敗時は同じバッチ全体が戻ります。
- 画像は非公開 R2 バインディングに保存し、[Images バインディング](https://developers.cloudflare.com/images/optimization/binding/) で幅・品質を指定して PNG を返します。既存の `/api/images/:id` を維持します。
- 新しい `POST /api/images` は8 MiB以下の JPEG / PNG / GIF / WebP をヘッダーから判別し、保存したキーを返します。
- Firebase Analytics / Storage、Firebase Emulator、sharp、Sentry の依存と設定を削除しました。ログは Workers Observability に集約します。PostgreSQL クライアントと Google Storage SDK は移行スクリプト用の開発依存です。
- `worker.ts` は `READ_ONLY=true` の場合、GET / HEAD / OPTIONS 以外を503にします。`.dev.vars` ではローカル開発用に `false` にできます。

`https://swimmy.localhost/` とCloudflare上の両方で、画面、一覧取得、画像保存と変換を確認しました。実画像・実データの最終照合結果は前述の記録とIssue #31を参照してください。
