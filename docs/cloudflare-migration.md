# Cloudflare 移行の記録

関連: [#29](https://github.com/shigurenimo/swimmy/issues/29)、[#31](https://github.com/shigurenimo/swimmy/issues/31)。2026-09-06 にアプリの Workers / D1 / R2 対応とリモート D1 への取り込みを実施しました。2026-09-07（JST）にユーザーが Push 禁止を解除し、main を Push、Worker の読み取り専用プレビューを公開しました。請求先の紐付けはユーザー承認後に完了し、既存画像を取得中です。本番ドメインの切り替えは未完了で、旧環境への書き込みとDNSは変更していません。

## リモート環境の検証

検証URLは https://swimmy.nocker.workers.dev/ です。Worker の初回バージョンは `e4634b25-e8c0-497a-b5d1-d2e7927eff87`。Wrangler の dry run 後にデプロイし、起動時間は24 msでした。

- Chromeで画面表示を確認し、`/`・`/threads`・`/api/posts` は200、存在しない画像は404でした。POSTは `READ_ONLY=true` により503となり、新しい投稿は保存しません。
- R2に合成テスト画像を保存し、元バイト列を読み戻してSHA-256一致、ImagesバインディングによるPNG配信200を確認しました。
- 転送スクリプトも現行・旧世代の合成画像2件で実行しました。保存キー・サイズ・全バイト列・配信メタデータが一致し、旧世代はアーカイブに分離されました。検証記録はリポジトリ外の `20260907-storage-transfer-probe/verified-metadata/verification.json` にあります。テスト画像は削除済みで、既存Firebase画像はまだ移行していません。
- `bun run check`、46件のテスト、`bun run build` が成功しました。
- Railway の `shigurenimo/swimmy` / `main` 連携を解除し、旧アプリが稼働したまま main を Push しました。GitHub Actionsに加え、Cloudflare Buildsも接続済みです。mainへのPushで `bun run check && bun run test && bun run build` を実行後、`bunx wrangler deploy --config dist/server/wrangler.json` で公開します。Bunは1.3.14、Node.jsは24、非本番ブランチのビルドは無効です。

Firebaseの請求先はユーザー承認後に紐付け、`billingEnabled: true` と実画像のダウンロード成功を確認しました。全画像の転送、書き込み停止中の最終同期、`swimmy.io` の切り替えが残っています。

## 確認できたデータ

PostgreSQL は Railway 上の 15.5。DB 全体は 28,971,823 bytes。サーバーのタイムゾーンは `Etc/UTC`、照合順序は `C.UTF-8`。`public` の全11テーブル・85列を、同じ読み取り専用トランザクションから取得しました。

| テーブル        |   行数 |
| --------------- | -----: |
| posts           | 31,253 |
| reactions       | 28,910 |
| users           |     67 |
| sessions        |      8 |
| _user_reactions |      0 |
| bookmarks       |      0 |
| friendships     |      0 |
| likes           |      0 |
| notifications   |      0 |
| references      |      0 |
| tokens          |      0 |
| 合計            | 60,238 |

空テーブル、現行画面で使っていないユーザー・セッション情報も保存しています。これは全アプリケーションテーブルの論理バックアップです。PostgreSQL のシステムカタログ、Timescale 拡張の内部テーブル、ロールなどを含む `pg_dump` の代替ではありません。旧DBを廃止する前には、Railway の復元用バックアップも別途確保します。

画像の保存先は Firebase Storage / Google Cloud Storage の `fqcwljdj7qt9rphssvk3.appspot.com`（東京リージョン）。DB の投稿・プロフィールから参照される固有キーは 1,191 件です。**これはバケット全体のファイル数ではありません。** 未参照画像と旧世代も調査・保存の対象にします。

請求先の紐付け後、全ページ・全世代を列挙し、現行1,904件、2,446,191,354 bytes、旧世代0件、ソフト削除済み0件を確認しました。全件をローカル保存中です。DB参照のうち1,190件は存在し、1件は元データの不正キーでした（[Issue #36](https://github.com/shigurenimo/swimmy/issues/36)）。推測でキーを書き換えず、元の内容を保持します。

同じプロジェクトのstagingバケットは0件、DatastoreモードのDBも名前空間の全件照会で0件でした。Firebase Authの67アカウントをページ末尾まで取得し、リポジトリ外の `20260907-google-inventory/firebase-auth-accounts.json` に保存しました。旧プロジェクト `umfzwkzvrtpe` のStorage照会はプロジェクト不存在エラーで、今回の現行バケットには含めていません。旧リソースの削除は行いません。

Cloudflare の Nocker アカウントに専用 D1 `swimmy`（APAC、ID はルートの `wrangler.jsonc`）と R2 `swimmy-images` を作成しました。D1 は取り込み・全行照合済み、リモート R2 は空です。公開側は `READ_ONLY=true` で書き込みを停止する構成です。

## 保存済みバックアップと検証結果

実データはリポジトリ外の `/Users/n/swimmy-migration-backups` にあります。親ディレクトリは所有者のみアクセス可能です。ユーザー・セッション情報を含むため、SQL、JSON、画像、検証ログを Git / Issue に添付しないでください。

| 保存先（上記ディレクトリからの相対パス） | 内容                                                                  |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `20260906-postgres/postgres.json`        | 2026-09-06 12:34:49 UTC の全アプリテーブル・実DB定義。8,803,096 bytes |
| `20260906-d1-verified/database.sqlite`   | 変換・照合済みSQLite。12,996,608 bytes                                |
| `20260906-d1-verified/schema.sql`        | 全テーブル・主キー・外部キー・22個の非主キーインデックス              |
| `20260906-d1-verified/data.sql`          | D1用データ。17,300,048 bytes                                          |
| `20260906-d1-verified/verification.json` | 各テーブルの行数・変換後全列のSHA-256                                 |
| `20260906-d1-verified/image-keys.json`   | DBが参照する1,191個の画像キー                                         |
| `20260906-d1-state`                      | Wrangler のローカルD1への実取り込み結果                               |

照合結果は `20260906-d1-verified/local-verification.json`、バックアップファイルのSHA-256一覧は `20260906-checksums.json` にも保存しています。

変換後SQLiteと、Wrangler 4.97.0 で取り込んだローカルD1の両方で、11テーブル・60,238行の内容ハッシュが一致しました。`foreign_key_check` は違反0件、`integrity_check` は `ok`。さらに Wrangler 4.129.0 でリモート D1 に取り込み、全データをエクスポートして再照合しました。11テーブル・60,238行すべての内容ハッシュが一致し、外部キー違反は0件、整合性検査も `ok` でした。取り込みは約79秒、60,253クエリ、DB容量は約13 MBです。

リモートへ取り込んだ最新成果物は `20260906-d1-ordered/` に保存しています。`schema.sql`、`data.sql`、`database.sqlite`、`verification.json`、`image-keys.json` に加え、読み戻した `remote-export.sql` / `remote-export.sqlite` と `remote-verification.json` を保存しました。先のバックアップも保持しています。

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

`scripts/migration/backup-storage.ts` で実バケットを取得中です。既存のサービスアカウント、または Application Default Credentials が必要です。必要な読み取り権限は `storage.buckets.get`、`storage.objects.list`、`storage.objects.get`。今回はGoogle Cloud CLIの通常のユーザー認証によるADCを使い、新しいサービスアカウント鍵の発行やIAM変更は実施していません。

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

転送前に全ローカルファイルのSHA-256とサイズを検査します。現行画像は元キー、旧世代は `_migration_archive/<元バケット>/<キーと世代から生成したハッシュ>` に保存し、衝突があれば中止します。`wrangler r2 object put/get --remote` で転送・全件読み戻しを行い、[R2の一覧API](https://developers.cloudflare.com/api/resources/r2/subresources/buckets/subresources/objects/methods/list/)でページを最後まで取得してキー集合・サイズ・配信メタデータを照合します。認証は既存のWranglerを使い、トークンはログやファイルに残しません。マニフェスト外の移行先オブジェクトは削除せず、処理を中止します。

全件成功時だけ新しい検証保存先に `verification.json` を作ります。失敗時は部分転送済みの画像を残すため、原因を直して別の検証保存先で再実行します。途中結果だけでは完了と判断しません。合成画像でリモート検証済みですが、実Firebase画像への適用は取得再開後です。

## アプリ側の移植

Next.js App Router / Hono の既存URLを維持して vinext + Cloudflare Vite plugin に移植しました。[Cloudflare の Next.js ガイド](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/) に沿った構成です。vinext はベータ版のため、本番切り替え前にリモート環境でも検証します。

- DB はリクエストごとの D1 バインディングと `drizzle-orm/d1` を使います。日時は `timestamp_ms`、配列は JSON、真偽値は boolean モードです。
- 返信作成は [D1 batch](https://developers.cloudflare.com/d1/worker-api/d1-database/) の条件付き INSERT と親の件数更新で処理します。途中失敗時は同じバッチ全体が戻ります。
- 画像は非公開 R2 バインディングに保存し、[Images バインディング](https://developers.cloudflare.com/images/optimization/binding/) で幅・品質を指定して PNG を返します。既存の `/api/images/:id` を維持します。
- 新しい `POST /api/images` は8 MiB以下の JPEG / PNG / GIF / WebP をヘッダーから判別し、保存したキーを返します。
- Firebase Analytics / Storage、Firebase Emulator、sharp、Sentry の依存と設定を削除しました。ログは Workers Observability に集約します。PostgreSQL クライアントと Google Storage SDK は移行スクリプト用の開発依存です。
- `worker.ts` は `READ_ONLY=true` の場合、GET / HEAD / OPTIONS 以外を503にします。`.dev.vars` ではローカル開発用に `false` にできます。

`https://swimmy.localhost/` で画面とローカル D1 の一覧取得を確認しました。生成したテスト画像のローカル R2 への保存と32pxへの変換は成功しています。これは元の Firebase 画像の移行を意味しません。最終検証の実行結果は Issue #31 に記録します。

## 実移行の順序と切り戻し

1. 画像の読み取りアクセスを回復し、全件バックアップ・検証を完了する。Google Cloudに存在するstagingバケット、旧Firebaseプロジェクト、Auth / Firestoreなどの残存データも確認する。現行コードで未使用という理由だけで削除対象にしない。
2. Workers対応とD1/R2実装をローカルで完成させる。`bun run check` / `bun run test` / `bun run build`、画面・API・アップロードを検証する。
3. 作成済みの専用D1/R2を使い、Workerの読み取り専用プレビューを検証する。本番ドメインの切り替え前に画像と最終データの準備を完了する。
4. 短時間の書き込み停止を設け、PostgreSQLとStorageの最終バックアップを取得する。両者のスナップショットは原子的ではないため、書き込み停止前のバックアップだけでは本番切り替えをしない。
5. 現在の容量では、最終スナップショットを空のD1へ再インポートする方式を基本とする。全行・全画像を再照合し、旧キーの画像が表示されることを確認してからトラフィックを切り替える。
6. 旧PostgreSQL・Firebase・配信環境と最終バックアップは保持する。新環境の書き込み開始前に問題があれば旧環境へ戻す。書き込み開始後は新規データを退避・反映してから戻すため、単純なDNS巻き戻しをしない。
7. 運用確認後、旧リソースの廃止を判断する。旧データの削除は今回の移行完了条件に含めず、バックアップとともに保持する。
