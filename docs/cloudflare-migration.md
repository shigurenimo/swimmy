# Cloudflare 移行の準備

関連: [#29](https://github.com/shigurenimo/swimmy/issues/29)。2026-09-06 に読み取り調査とローカル移行を実施。本番の設定・データ・課金は変更しておらず、Push・デプロイも実施していません。

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

Firebase コンソールには Blaze へのアップグレード案内が表示されました。Google Cloud コンソールでは画像一覧とメタデータを閲覧できましたが、画像1件のダウンロードは 403。ローカルには Google の読み取り用資格情報がありません。現時点では画像の全件取得・容量集計・R2 への転送は未実施です。権限と課金状態を確認する必要があり、一覧が見えるだけでは取得可能とは判断しません。

Cloudflare は Nocker アカウントへの認証と D1 / R2 一覧取得を確認しました。既存サービスがあるため、移行先には Swimmy 専用リソースを作ります。アカウント選定・リソース作成は実移行時に確定します。

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

変換後SQLiteと、Wrangler 4.97.0 で取り込んだローカルD1の両方で、11テーブル・60,238行の内容ハッシュが一致しました。`foreign_key_check` は違反0件、`integrity_check` は `ok`。これはローカルエンジンでの検証であり、リモートD1の性能・実行時間の検証は残っています。

## PostgreSQL → D1 の変換

| PostgreSQL     | D1 / SQLite       | 保持する内容                        |
| -------------- | ----------------- | ----------------------------------- |
| `text`         | `TEXT`            | 空文字、改行、絵文字、引用符        |
| `text[]`       | JSON形式の `TEXT` | 配列順序、`NULL` と空配列の区別     |
| `timestamp(3)` | `INTEGER`         | 格納日時をUTCとしてミリ秒単位で保存 |
| `boolean`      | `INTEGER` + CHECK | 0 / 1 と nullable の区別            |
| 列挙型         | `TEXT` + CHECK    | 値と許可値の制約                    |
| `integer`      | `INTEGER`         | 整数値                              |

主キー、ユニークインデックス、外部キーの削除・更新アクションは実DBから取得します。コード側の `db/schema.ts` には外部キー・インデックスの不足があるため、[Issue #30](https://github.com/shigurenimo/swimmy/issues/30) で別途追跡します。推測で制約を落としません。未対応の型・式・ビュー・トリガーなどを検出した場合はスクリプトを失敗させます。

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

同梱の Wrangler 設定はローカル専用の仮IDです。本番IDを記入したり、その設定でデプロイしたりしません。SQLは [D1のインポート仕様](https://developers.cloudflare.com/d1/best-practices/import-export-data/) に従い、`BEGIN` / `COMMIT` を含めていません。途中で失敗した場合は、既存DBへ続きを流さず、新しい空の移行先でやり直します。

## 画像の全件保存と R2

`scripts/migration/backup-storage.ts` を準備済みです。実バケットでの成功確認は、読み取りアクセスが回復してから行います。既存のサービスアカウント、または Application Default Credentials が必要です。必要な読み取り権限は `storage.buckets.get`、`storage.objects.list`、`storage.objects.get`。新しい鍵の発行やIAM変更は実施していません。

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

転送には元キーとファイルを対応させて `wrangler r2 object put` を使えます。大量の転送には [Super Slurper のGCS対応](https://developers.cloudflare.com/r2/data-migration/super-slurper/) も利用できますが、ユーザーの希望するローカル保存・照合は別途実施します。今回、R2バケット作成・アップロード用資格情報の発行・転送ジョブの開始は行っていません。

## アプリ側の移植箇所

| 現在                                              | 移植内容                                                                                  |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Next.js 16 App Router / Hono                      | Workers で画面とAPIを実行。既存URLを維持                                                  |
| `db/index.ts` の `pg.Pool`                        | リクエストのD1バインディングと `drizzle-orm/d1`                                           |
| `db/schema.ts` の `pg-core`                       | `sqlite-core`、日時は `timestamp_ms`、配列はJSON、真偽値はbooleanモード。実DBの制約を維持 |
| `service/posts.ts`                                | PostgreSQLの `least` をSQLiteの `min` へ。返信の親確認と作成をD1で原子的に処理            |
| `service/images.ts` のFirebase Admin / sharp      | 非公開R2バインディングから取得し、必要ならCloudflare Imagesで変換                         |
| `use-file-uploader.ts` のFirebase直接アップロード | WorkerのアップロードAPIへ変更。キーを維持し、形式・容量をサーバー側でも検証               |
| `app/providers.tsx` のFirebase Analytics          | Firebase依存を取り除く。分析が必要ならCloudflare側で設定                                  |
| Sentry のNode依存                                 | Workers互換性を確認。Cloudflareへ運用を集約する場合はWorkers Observabilityへ移行          |
| Firebase Emulator / PostgreSQL のローカル環境     | ローカルD1 / R2へ移行。実移行後に不要な依存・設定を削除                                   |

現在の [CloudflareのNext.jsガイド](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/) は vinext を案内しています。`bunx vinext@latest check` は、12項目対応・1項目要変更（`package.json` の `type: module` 不足）、92%対応でした。現行のVite+との統合候補ですが、ベータであり、本番利用前にAPI・画像・CSS・エラー処理をWorkers上で検証します。互換性が不足する場合は [OpenNext](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/) を評価します。互換性チェックだけで稼働保証とはしません。アプリの依存や起動方法は今回変更していません。

D1ではPostgreSQLのコールバック形式トランザクションをそのまま使えません。[D1のbatch](https://developers.cloudflare.com/d1/worker-api/d1-database/) と条件付きINSERTなどで、親投稿の確認から返信作成までの競合を防ぎます。読み取り後の無条件INSERTへの置換は避けます。ページングの同時刻・ID境界、リアクションの上限、日時のAPI表現も既存テストと実機で確認します。

画像変換は [Imagesバインディング](https://developers.cloudflare.com/images/optimization/binding/) が候補です。元画像はR2へ保存し、既存の幅・品質パラメーターとの違いを確認してから切り替えます。

## 実移行の順序と切り戻し

1. 画像の読み取りアクセスを回復し、全件バックアップ・検証を完了する。Google Cloudに存在するstagingバケット、旧Firebaseプロジェクト、Auth / Firestoreなどの残存データも確認する。現行コードで未使用という理由だけで削除対象にしない。
2. Workers対応とD1/R2実装をローカルで完成させる。`bun run check` / `bun run test` / `bun run build`、画面・API・アップロードを検証する。
3. 移行先アカウント・ドメイン・料金を確定し、許可後に専用の検証用D1/R2/Workerを作成する。リモートへの取り込み・読み戻し・性能検証を行う。
4. 短時間の書き込み停止を設け、PostgreSQLとStorageの最終バックアップを取得する。両者のスナップショットは原子的ではないため、書き込み停止前のバックアップだけでは本番切り替えをしない。
5. 現在の容量では、最終スナップショットを空のD1へ再インポートする方式を基本とする。全行・全画像を再照合し、旧キーの画像が表示されることを確認してからトラフィックを切り替える。
6. 旧PostgreSQL・Firebase・配信環境と最終バックアップは保持する。新環境の書き込み開始前に問題があれば旧環境へ戻す。書き込み開始後は新規データを退避・反映してから戻すため、単純なDNS巻き戻しをしない。
7. 運用確認後、別途承認を得て旧リソースを廃止する。Git Pushはデプロイに直結するため、禁止が解除されるまでは実施しない。
