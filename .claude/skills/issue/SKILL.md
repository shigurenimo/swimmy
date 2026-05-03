---
name: issue
description: Manage GitHub Issues.
when_to_use: Create, update, investigate, or plan a GitHub Issue. Examples: `/issue {number}`, `/issue {description}`.
metadata:
  author: shigurenimo
  description: GitHub Issue の作成・更新・調査・技術計画を行うスキル。別セッションでも意思決定と実装方針を再現できる状態を保つ。
  dev: true
---

GitHub Issue を作成・更新・調査・計画するためのスキル。Issue は GitHub Issue Type で 3 種類に分ける。Label は使わない。Claude が別セッションで作業を再開するとき、ここに書かれた情報だけで意思決定の経緯と実装方針を再現できる状態にする。

実装そのものは扱わない。実装は `pr` スキルに引き継ぐ。

## Issue Type

3 種類の type を使い分ける。

- `Bug` — 不具合の集約。「計画に移せない大きい不具合」「これから調査が必要な不具合」など。実装計画は持たない
- `Feature` — 要望の集約。「計画に移せない大きい要望」「実装方針がまだ固まらない要望」など。実装計画は持たない
- `Task` — 実装計画。これだけ特別。技術計画と Tasks リストを書く。Bug / Feature とは独立して作ってよい

選び方:

- 実装計画として書ける粒度なら → `Task`
- 大きい / 計画に落とせない / まだ調査段階の **不具合** → `Bug`
- 大きい / 計画に落とせない / まだ調査段階の **要望** → `Feature`

`Bug` や `Feature` から派生して `Task` を切ることもあるが、`Task` は必ずしも親 (`Bug`/`Feature`) を持たない。直接 `Task` だけを作って実装に進んでよい。

組織で 3 種類が enabled か最初に確認する。

```bash
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
OWNER=${REPO%%/*}
gh api "/orgs/$OWNER/issue-types" --jq '.[] | select(.is_enabled) | .name'
```

Issue 作成時は `gh issue create --type Bug|Feature|Task` を必ず指定する。

リポジトリ・組織名はハードコードしない。`gh repo view` で動的取得する。

## Arguments

```
/issue {number}
/issue {description}
```

番号あり: その Issue を取得して調査・計画する。

番号なし: description から新規 Issue を作成する。作成前に `gh issue list` で重複をチェックし、重複があれば既存 Issue を使うか新規作成するかをユーザーに確認する。

## Workflow

### Inspect phase

番号あり始動時は必ず最初に現状を確認する。勝手に上書きしない。

- `gh issue view {number}` で Issue 本文を取得し、`## Plan` セクションが既に埋まっているか判定する
- `gh pr list --search "{number} in:body" --state all --json number,title,state,headRefName,isDraft` で紐づく PR を検索する
- 結果をユーザーに提示してから分岐する
  - 既存 PR あり → 「既存 PR に乗る / 新規 PR を作る」を確認。乗る場合は Plan phase をスキップして `pr` スキルへ引き継ぐ
  - 既存 PR なし かつ 既存 Plan あり → 「既存 Plan を使う / 更新する / 作り直す」を確認
  - 既存 PR なし かつ 既存 Plan なし → そのまま Plan phase へ進む

### Plan phase

`issue-planning` スキルを使って技術計画を作成し、Issue body に書き込む。

- 「作り直す」を選んだ場合はフル計画を再生成して上書きする
- 「更新する」を選んだ場合は既存 Plan を読み込み、差分のみを反映する
- 「既存 Plan を使う」を選んだ場合はこの phase 自体をスキップする

### Report

計画と PR 状況をユーザーに提示し、実装に進むか確認する。

- 進める: `pr` スキルを起動する。`pr {number}` で Issue 番号を渡し、既存 PR があればその PR 番号も明示する
- 止める: ワークフロー終了

## Assignment

GitHub Issue のアサインを管理する。話しかけた人 (`gh api user` の login) を Issue に付け、他の人間 / Claude とのアサイン衝突を避ける。

### Repository / user resolution

ハードコードしない。

```bash
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
ME=$(gh api user --jq .login)
```

### 操作

- `mine` — 自分にアサインされた open Issue の一覧 (`gh issue list --assignee "@me" --state open`)
- `unassigned` — 誰にもアサインされていない open Issue の一覧 (`gh issue list --search "no:assignee" --state open`)
- `assign {N}` — Issue N を自分にアサイン
- `release {N}` — Issue N の自分のアサインを外す (`gh issue edit N --remove-assignee "@me"`)

### Assign の判定フロー

各 Issue 番号 N について `gh issue view N --json number,title,state,assignees,issueType` を取って判定する。

- `state == "CLOSED"` → スキップ (close 済みにアサインしない)
- `assignees` に自分が含まれる → already assigned. スキップ
- `assignees` に他人がいる → 共同アサインするか `AskUserQuestion` で確認。Yes なら `gh issue edit N --add-assignee @me` で共同アサイン。No ならスキップ
- `assignees` が空 かつ `issueType.name == "Feature"` → 要望集約用なのでアサイン通常不要。`AskUserQuestion` で確認してから実行
- `assignees` が空 かつ `issueType.name in ("Bug", "Task", null)` → そのままアサイン

### Conflict avoidance

- 他人がアサイン中の Issue に **無断で自分を追加しない** (確認必須)
- close 済み Issue にアサインしない
- 同一 Issue を複数の Claude セッションで取り合うのを避けるため、`assign` 実行後にもう一度 `gh issue view` で実際にアサインされたか確認する。失敗していれば再試行せず、ユーザーに状況を報告する

## Template の一次ソース

テンプレート本体はリポジトリの `.github/ISSUE_TEMPLATE.md`（単一デフォルト方式）に置く。Issue 作成時はこのファイルを読み込んで埋める。ブラウザから Issue を開いたときも同じ雛形が自動適用される。

## Template の自動作成

Issue を作成する前にリポジトリの `.github/` をチェックし、次の条件分岐で処理する。

- `.github/ISSUE_TEMPLATE.md` が存在する → そのまま使う
- `.github/ISSUE_TEMPLATE.md` も `.github/ISSUE_TEMPLATE/` ディレクトリも存在しない → 下記「Template」セクションの内容で `.github/ISSUE_TEMPLATE.md` を新規作成し、同じコミットに含める
- `.github/ISSUE_TEMPLATE/` ディレクトリが既に存在する → 自動作成はスキップする。オーナーに「単一テンプレートに統一しますか？」と確認し、承認を得てからディレクトリ削除＋単一ファイル作成を行う。勝手にディレクトリを削除しない

## Purpose

- 実装に必要な技術的コンテキストを失わないよう記録する
- Claude が後で読み返したとき、思考の流れと判断理由を追えるようにする
- 冒頭の概要だけは人間（非開発者含む）が読んで状況を把握できるようにする

## Rules

- 冒頭の概要は人間向け。技術用語を避け、何を・なぜ変えるかを自然な文章で書く（見出しなし）
- 必須セクションは固定。順序を変えない
- 必須セクションの後に、任意セクションを自由に追加してよい
- Claude が残したい情報（調査メモ、検討した代替案、試行錯誤の記録など）は何でも書いてよい
- Notion タスクが存在する場合は冒頭に `[TASK-{番号}](Notion URL)` を記載する (タイトル規則は下記 `Title` 参照)

## Template (type:Task)

実装計画を書く。技術詳細を書いてよい。

Task は以下の 2 通りの作り方がある:

- 直接 Task を作る — 既に計画が書ける小さい単位
- Bug / Feature から派生して作る — 大きい不具合 / 要望を 1+ 個の Task に分解した結果

派生で作る場合は親 Bug / Feature 番号を `Parent: #N` で書く。Bug / Feature を実装に進めるときは必ず 1 個以上の Task を派生させる (Bug / Feature 自体には実装計画を書かない)。

```
[人間向けの概要。何を・なぜ変更するのか。背景と目的を自然な文章で書く]

Parent: #{親 Bug / Feature 番号}    ← 派生で作るときだけ書く

## Technical Challenges

[影響するファイル・API・データ構造・実装上の懸念など技術的な事実を列挙する]

## Plan

[実装方針とその理由。なぜこのアプローチを選んだか、どのような手順で進めるか、考慮したトレードオフを自然な文章で説明する。箇条書きだけでなく、思考の流れを追えるレベルの詳細さが必要]

### Tasks

- [ ] タスク1
- [ ] タスク2
```

### Required Sections (Task)

- 冒頭の概要（見出しなし）
- Technical Challenges
- Plan（Tasks サブセクションを含む）

派生 Task の場合は冒頭の概要直後に `Parent: #N` を入れる。

### Optional Sections (Task)

必須セクションの後に自由に追加してよい。例:

- Notes - 参考情報、関連ファイル、ワークアラウンド
- Research - 調査内容、参考資料、読んだドキュメント
- Alternatives Considered - 検討した代替案と却下理由
- Debug Log - デバッグの過程と発見
- Dependencies - 依存関係、前提条件
- Migration - データ移行やスキーマ変更の詳細

## Template (type:Bug / type:Feature)

不具合 / 要望の集約。**非開発者 (経営者・企画担当者) が読む**。技術用語・ファイル名・コードは書かない。

Bug / Feature 自体には実装計画を書かない。実装に進むときは派生 Task (1 個以上) を作って、そこに技術計画を書く。1 つの Bug / Feature が複数の Task に分解されることが普通。

```
[人間向けの概要。何が起きていて何を直したいか / 何を実現したいか。誰のために、何が変わるか、なぜ必要か]

## Source

- Notion: [TASK-{番号}](Notion URL)        ← Notion から来たとき
- Sentry: [{SHORT_ID}](Sentry permalink)   ← Sentry から来たとき
- Voice: [[signals/{slug}]]                ← 顧客の声から来たとき
- Direct: {誰} / {YYYY-MM-DD}              ← 直接の対話から来たとき

(該当する行のみ残す。複数 source を持ってよい)

## Scope

- やること: {何が変わる / 直る}
- やらないこと: {スコープ外を明示}
- 影響範囲: {誰のどの体験}

## Tasks

派生 type:Task の一覧。実装に着手するときに 1 つ以上必ず追加する。

- [ ] #{番号} 派生 Task タイトル
- [ ] #{番号} 派生 Task タイトル

派生 Task が close されたら対応行を `[x]` に更新する。すべての派生 Task が close されたら Bug / Feature 自体も close する。

## Notes

任意。背景補足、関連 Issue、検討メモ、ステークホルダーなど。
```

### Required Sections (Bug / Feature)

- 冒頭の概要 (見出しなし、人間向け)
- Source
- Scope
- Tasks (実装着手前は空でよい。着手時に派生 Task を追加する)

### Optional Sections (Bug / Feature)

- Notes - 背景補足、関連 Issue、検討メモ
- Decisions - 過去の意思決定の記録
- Open questions - 未決事項

## Title

タイトル規則は **type:Task のみ** 適用する。Bug / Feature にはプレフィックスを付けない。

- `Task` で Notion 由来 → `TASK-{N} - {タスク名}` (`{N}` は Notion 側の TASK ID = auto_increment_id)
- `Task` でそれ以外 → `{要約}` (プレフィックスなし)
- `Bug` → `{要約}` (プレフィックスなし)
- `Feature` → `{要約}` (プレフィックスなし)

Notion 側の `TASK-{N}` は Issue type の `Task` とは別概念。Notion 由来の Task 計画にだけ TASK 番号プレフィックスを付ける。

Source の識別 (Sentry 由来か Voice 由来か等) はタイトルではなく本文の `## Source` で行う。

## Bug / Feature と Task の連携

Bug / Feature を実装に進めるときは、必ず 1 つ以上の Task に分解して派生させる。1 つの Bug / Feature が複数 Task に分かれることが普通 (フェーズ分け、レイヤー分け、ワークスペース分け等)。

派生 Task の作り方:

- 派生 Task の body 冒頭 (概要直後) に `Parent: #{親 Bug/Feature 番号}` を書く
- 親 Bug / Feature の `## Tasks` に派生 Task 番号を追記する: `- [ ] #N タイトル`
- 派生 Task が close されたら、親の `## Tasks` の対応行を `[x]` に更新する
- 親 Bug / Feature の `## Tasks` がすべて `[x]` になったら、親自体を close する

直接 Task を作る場合 (Bug / Feature を経由しない) は `Parent` 行を書かない。これは「即計画できる小さい単位」用で、Bug / Feature を立てる手間を省けるとき限定。

GitHub Sub-issues 機能を使う場合は body の参照と併用してよい (両方を維持)。

## Skills and plugins

Invoke via the Skill tool.

- `issue-planning`: Create technical plan text for a Task Issue.
- `pr`: Implement against this Issue's plan and open a PR.
- `feature-dev`: Investigate codebase and assess impact.
- `superpowers`: Spawn parallel agents, create plans, review code.
