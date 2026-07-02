# /docs drift

仕様書（README / .docs/ 配下）と実装の乖離を検出する。「実装済」と書かれているが動かない、「未実装」と書かれているが動く、テーブル数・画面数・ロール権限の食い違いを洗い出す。

## 起動条件

`/docs drift` 単独、または `/docs drift {対象範囲}` で起動する。

- `/docs drift` — 全 docs と全実装の突合
- `/docs drift features` — 機能仕様だけ
- `/docs drift schema` — データモデル（DATA セクション、または `models/` 配下の分割ファイル）だけ
- `/docs drift roles` — ロール権限だけ

## コスト

中。レンズ数次第で 20〜100 agent。budget.total を見てスケールする。

## 出力

検出した乖離は次のいずれかで処理する。

- 軽微な追従（コード正・docs を直す）はその場で docs を更新する
- 判断が要るもの（仕様変更か実装修正か未確定）は `tasks.md` の「人間判断待ち」または相当セクションへ追記する
- 既出（GitHub Issue・tasks.md・backlog/signal）と重複するものは捨てる

## 実行フロー

### Step 1 範囲特定

docs から「主張」を抽出する。

- index.md の実装ステータス記号（実装済・モック・スタブ・未着手）
- features/ の機能仕様（ロール・URL・できること）
- DATA セクションのテーブル数・カラム名・FK（テーブル40+で `models/` に分割されている場合は `models/index.md` のテーブル一覧と各 `models/*.md` を対象に含める）
- roles-and-permissions の宣言
- milestones の Phase 振り分け
- pages.md の画面一覧と URL

### Step 2 実装側の事実抽出（並列）

各主張に対応する実装側の事実を取る。

- ルート／エントリポイント一覧（実装画面）
- requireRole 宣言（実 API のロール）
- スキーマ定義（実テーブル・実カラム）。マイグレーション履歴も見て、DROP 済みテーブル・撤去カラムが docs に残っていないか突合する（docs はリネーム前・廃止前の旧定義を引きずりやすい）
- 機能の動作（モックかライブデータか）

### Step 3 突合と分類

docs 側主張と実装側事実を 1:1 で突合し、乖離を分類する。

- docs 過大（仕様にあるが実装無い）
- docs 過少（実装にあるが仕様無い）
- ステータス誤り（docs「実装済」だが実態はモック・スタブ・到達不能）
- 数の不一致（テーブル数・画面数・ロール数）
- 権限の不一致（docs「全ロール」だが実 API は management 限定など）

### Step 4 敵対的検証

各乖離が本物か、refute-by-default の懐疑エージェントで裏取りする。誤検知・既知の意図的乖離（ステージング中・社内非公開）は捨てる。

### Step 5 振り分けと書き戻し

確定した乖離を 3 つに振り分ける。

- 軽微な追従（docs を直すだけ）→ その場で docs を編集
- 判断保留（仕様変更か実装修正か未確定）→ tasks.md へ追記
- 既出 → 捨てる

## 実装ガイド

- Workflow を使う（直列禁止）
- meta.name は `docs-drift-detect`
- finder は subagent_type=Explore
- 検証は subagent_type=general-purpose、refute-by-default
- docs 編集は SKILL.md の writing-rules.md と human-claude-zone.md に従う

## 報告

- 主張数・乖離検出数・確定数・棄却数
- docs 直接更新した件数・tasks.md へ追記した件数
- 重大な乖離（出荷ブロッカー級）は警告として先頭に明記

## 禁止事項

- Workflow を使わずに直列で agent を呼ばない
- 軽微な追従を tasks.md に流さない（直接 docs を直す）
- 判断保留を docs 本文に勝手に書き換えない（tasks.md へ）
- 既出を再掲しない
