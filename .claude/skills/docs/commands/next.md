# /docs next

コードベースとドキュメントを多レンズで完全探索し、今すぐ着手すべき価値の高いタスクを `tasks.md` に追記する。Workflow による並列ファンアウトで網羅性を担保する。リポジトリ非依存。

## 起動条件

`/docs next` 単独、または `/docs next {対象スコープ}` で起動する。

- `/docs next` — 全体総ざらい
- `/docs next 出荷前` — リリースブロッカーに絞る
- `/docs next セキュリティ` — 観点で絞る

## コスト

重い。300+ agent・数百万 token 規模。budget.total を見てスケールする。

## 出力先

`.docs/tasks.md`（無ければ `tasks.md`）の既存セクションに追記する。新規セクション追加は最終手段。書式は SKILL.md 本文と writing-rules.md に従う。

## 実行フロー

スキル自体が計画と実行を担う。事前にレンズやパスを決め打たない。

### Step 1 リポジトリ把握

実行前に対象リポジトリを軽く読み、以下を把握する。

- 言語・フレームワーク（package.json / Cargo.toml / go.mod / pyproject.toml ほか）
- ディレクトリ構成（src 配下・docs 配下・tests 配下の有無）
- 既存ドキュメント（README / CLAUDE.md / .docs / DESIGN.md）
- 既存 tasks.md の現状（追記対象セクション・既出項目）
- Git 状況（open PR・open Issue・recent commits）
- リリース計画やマイルストーンの有無

把握した内容をもとに、次のステップで使うレンズ集合を自分で決める。

### Step 2 レンズ計画

リポジトリの性質に応じてレンズを選ぶ。下記から該当するものを使い、必要なら自作する。少なくとも 8 レンズ以上は走らせる。

汎用レンズ

- 仕様ドリフト — 仕様書／README と実装の乖離
- 実装漏れ — 仕様にあるが実装されていない、または逆
- 価値ギャップ — UI は出るが価値が薄い／誤期待を生む画面・機能
- 判断保留 — 仕様未確定で実装が進められない箇所
- 既存 Issue/PR 未反映 — open 状態のうち tasks.md 未捕捉のもの
- backlog/signal 未反映 — 顧客の声・未着手のバックログ

技術レンズ

- ルート／エントリポイント探索 — プレースホルダ・モック・silent fallback
- API／ハンドラ探索 — 認可漏れ・スコープ抜け・入力検証穴・トランザクション境界
- スキーマ／データモデル探索 — FK 不在・nullable 不整合・index 欠損・docs 乖離
- フロントエンド／UI 探索 — エラー境界・レスポンシブ・印刷・アクセシビリティ
- テスト探索 — broken spec・skip されたテスト・カバレッジ穴
- セキュリティ探索 — CSRF/XSS/SQLi・CSP・JWT・rate limit・依存 CVE
- パフォーマンス探索 — 大量データの応答・bundle・メモリ
- インフラ／運用探索 — デプロイ設定・環境変数・cron・bindings・observability・rollback
- TODO/FIXME 探索 — 暫定実装・コメントの判断保留

ドメインレンズ（リポジトリの性質で増減）

- データ移行 — 既存システムからの取込導線
- 法令・コンプライアンス — 業界特有の保存義務・削除権限・監査要件
- 多言語・タイムゾーン — i18n・JST/UTC 境界
- 障害対応 — runbook・SLA・連絡経路

### Step 3 Workflow 必須

直列で agent を呼ばない（網羅性が下がる）。Workflow ツールで次の構造を組む。

第 1 フェーズ Discover R1（並列）。Step 2 で選んだレンズで finder を fan-out する。各 finder は schema 付きで `{ findings: [{ title, file_path, severity, kind, rationale }] }` を返す。

第 2 フェーズ Discover R2（ループ枯渇判定）。R1 の findings を全 finder に提示し、新規だけ返してもらう。R2 が大幅に少ないなら打ち切り、それでも多ければ R3 まで回す。

第 3 フェーズ Verify（敵対的検証）。各 finding に対し refute-by-default の懐疑エージェントを当てる。重要レンズは 3 体並列で多数決。実在判定と既出判定を返す。

第 4 フェーズ Dedup & Cross-check（バリア）。tasks.md・既存 Issue・backlog/signal と突合して既出を捨てる。レンズ間で重複した findings は 1 行に寄せる。

第 5 フェーズ Prioritize。残った findings を severity で並べる。

- blocker — リリースを物理的に止める
- high — 顧客可視のバグ・セキュリティ・誤データ
- medium — 判断保留・価値ギャップ
- low — 技術負債・将来課題

第 6 フェーズ Write。tasks.md に追記する。既存セクションへ振り分ける。新規セクションは新カテゴリが出たときのみ。各行は `- [kind] タイトル (file_path) — 根拠と判断軸` の形式。

### Step 4 Workflow 実装ガイド

- meta.name は `next-discovery`
- finder は subagent_type=Explore を使う
- 検証エージェントは subagent_type=general-purpose、prompt に「default to refuted=true」を明記
- budget.total を見て与えられた予算でスケールする（レンズ数・検証票数・ループ回数を予算で決める）
- log() で各フェーズの開始・件数・打ち切り条件を narrate する
- finder の prompt に「既出（tasks.md・open Issue・backlog）と重複しないものに絞る」を明記する
- 検証 agent の prompt に「具体的にコードを Read して裏取りせよ」を明記する

### Step 5 報告

最終メッセージで次を報告する。

- レンズ数・ラウンド数・生 findings 数・確定数・棄却数
- 確定 findings の severity 別件数
- 出荷ブロッカーが新規に見つかった場合は警告として先頭に明記する
- 追記したセクション名と件数

## 禁止事項

- Workflow を使わずに直列で agent を呼ばない
- レンズを 1〜2 種で済ませない（最低 8 種）
- ループを 1 ラウンドで打ち切らない（必ず枯渇判定を入れる）
- 既出を再掲しない（tasks.md・Issue・backlog/signal と突合する）
- tasks.md に新規セクションを安易に切らない（既存セクションへ振り分ける）
- リポジトリ固有のパスやファイル名をこのコマンド本文にハードコードしない（実行時に Step 1 で把握する）
