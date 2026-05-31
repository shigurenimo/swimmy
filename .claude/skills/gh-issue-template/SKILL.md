---
name: gh-issue-template
description: Canonical templates and operating rules for writing GitHub Issues and Pull Requests (PR templates included despite the name).
when_to_use: When writing or updating the body of a GitHub Issue or Pull Request.
user-invocable: false
disable-model-invocation: false
metadata:
  author: shigurenimo
  description: GitHub Issue / PR を書き込む際のテンプレート・必須セクション・Title 規則・Assignment ルール・Issue Type の規約。
  dev: false
  tools: gh
---

GitHub Issue と Pull Request を書き込む時のテンプレートと運用ルールをまとめたスキル。Issue / PR の本文を作る前に必ず参照する。

Issue は Claude が後で読み返したときに意思決定の経緯と実装方針を再現できる状態に保つ。PR は実装結果を記録する場所で、計画は書かない。

## リポジトリとユーザーの取得

リポジトリ名・組織名・ログイン名はハードコードしない。必要になった都度、次のコマンドで動的に取得する。

```bash
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
OWNER=${REPO%%/*}
ME=$(gh api user --jq .login)
```

## Issue Type

Issue は GitHub Issue Type で 3 種類に分ける。Label は使わない。

Bug は不具合の集約。計画に移せない大きい不具合、これから調査が必要な不具合など。実装計画は持たない。

Feature は要望の集約。計画に移せない大きい要望、実装方針がまだ固まらない要望など。実装計画は持たない。

Task は実装計画。技術計画と Tasks リストを書く。Bug / Feature とは独立して作ってよい。

選び方

実装計画として書ける粒度なら Task。大きい・計画に落とせない・まだ調査段階の不具合は Bug。同じ性質の要望は Feature。

Bug / Feature から派生して Task を切ることもあるが、Task は必ずしも親を持たない。直接 Task だけを作って実装に進んでよい。

組織で 3 種類が enabled か最初に確認する。

```bash
gh api "/orgs/$OWNER/issue-types" --jq '.[] | select(.is_enabled) | .name'
```

Issue 作成時は `gh issue create --type Bug|Feature|Task` を必ず指定する。

## .github 雛形ファイルの優先順位

`.github/ISSUE_TEMPLATE.md` と `.github/PULL_REQUEST_TEMPLATE.md` は GitHub UI が自動適用する雛形ファイル。Claude が本文を組み立てる時の優先順位は次の通り。

雛形ファイルがあればそれを優先する。下記の Template セクションはあくまでフォールバック。雛形が無い・壊れている・このスキルの方針と整合しない場合のみ、このスキルの Template に従って本文を組み立てる。

必須セクション・順序・Title 規則・Assignment ルールはこのスキルが常に正本。雛形ファイルがこのスキルの方針と矛盾する場合は雛形を優先せず、ユーザーに矛盾を報告する。

### Issue 雛形の取り扱い

Issue を作成する前に `.github/` をチェックし、次のように分岐する。

`.github/ISSUE_TEMPLATE.md` が存在する場合は、そのファイルを読み込んで埋める。

`.github/ISSUE_TEMPLATE.md` も `.github/ISSUE_TEMPLATE/` ディレクトリも存在しない場合は、下記「Issue Template」セクションの内容で `.github/ISSUE_TEMPLATE.md` を新規作成し、同じコミットに含める。

`.github/ISSUE_TEMPLATE/` ディレクトリが既に存在する場合は、自動作成をスキップする。「単一テンプレートに統一しますか」とオーナーに確認し、承認を得てからディレクトリ削除と単一ファイル作成を行う。勝手にディレクトリを削除しない。

### PR 雛形の取り扱い

PR を作成する前に `.github/PULL_REQUEST_TEMPLATE.md` をチェックする。

存在する場合はそのファイルを読み込んで埋める。

存在しない場合は、下記「PR Template」セクションの内容で新規作成し、同じコミットに含める。既に存在する場合は勝手に上書きしない。

## 共通ルール

冒頭の概要は人間向け。技術用語を避け、何を・なぜ変えるかを自然な文章で書く。見出しは付けない。

必須セクションは固定。順序を変えない。

必須セクションの後に、任意セクションを自由に追加してよい。

Claude が残したい情報（調査メモ、検討した代替案、試行錯誤の記録など）は何でも書いてよい。

Notion タスクが存在する場合は、Issue 冒頭に `[TASK-{番号}](Notion URL)` を、PR の closes 行に `[TASK-{番号}](Notion URL)` を追記する。

プロパティ形式（「リスク評価:」のような Key: Value）は使わない。自然な文章で書く。

## Issue Template (type:Task)

実装計画を書く。技術詳細を書いてよい。

Task は 2 通りの作り方がある。直接 Task を作る場合は既に計画が書ける小さい単位。Bug / Feature から派生して作る場合は大きい不具合 / 要望を 1 個以上の Task に分解した結果。

派生で作る場合は親 Bug / Feature 番号を `Parent: #N` で書く。Bug / Feature を実装に進めるときは必ず 1 個以上の Task を派生させる。Bug / Feature 自体には実装計画を書かない。

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

必須セクション

冒頭の概要（見出しなし）、Technical Challenges、Plan（Tasks サブセクションを含む）。派生 Task の場合は冒頭の概要直後に `Parent: #N` を入れる。

任意セクションの例

Notes、Research、Alternatives Considered、Debug Log、Dependencies、Migration。

## Issue Template (type:Bug / type:Feature)

不具合 / 要望の集約。非開発者（経営者・企画担当者）が読む。技術用語・ファイル名・コードは書かない。

Bug / Feature 自体には実装計画を書かない。実装に進むときは派生 Task を 1 個以上作って、そこに技術計画を書く。1 つの Bug / Feature が複数の Task に分解されることが普通。

```
[人間向けの概要。何が起きていて何を直したいか / 何を実現したいか。誰のために、何が変わるか、なぜ必要か]

## Source

- Notion: [TASK-{番号}](Notion URL)
- Sentry: [{SHORT_ID}](Sentry permalink)
- Voice: [[signals/{slug}]]
- Direct: {誰} / {YYYY-MM-DD}

## Scope

- やること: {何が変わる / 直る}
- やらないこと: {スコープ外を明示}
- 影響範囲: {誰のどの体験}

## Tasks

派生 type:Task の一覧。実装に着手するときに 1 つ以上必ず追加する。

- [ ] #{番号} 派生 Task タイトル
- [ ] #{番号} 派生 Task タイトル
```

Source は該当する行のみ残す。複数 source を持ってよい。

Tasks の派生 Task が close されたら対応行を `[x]` に更新する。すべての派生 Task が close されたら Bug / Feature 自体も close する。

必須セクション

冒頭の概要（見出しなし、人間向け）、Source、Scope、Tasks（実装着手前は空でよい。着手時に派生 Task を追加する）。

任意セクションの例

Notes、Decisions、Open questions。

## PR Template

PR は実装結果を記録する場所。計画は Issue 側に書く。PR には書かない。

```
closes #<Issue番号>

[人間向けの概要。何が変わるか、何が良くなるかを自然な文章で書く。リスクや影響があれば触れる]

## Verification

- [ ] 対象機能の動作確認
- [ ] 既存機能への影響確認
```

必須セクション

closes 行（Issue リンク）、冒頭の概要（見出しなし）、Verification（実際にブラウザ操作や API 呼び出しで確認した内容。test / build などの技術的チェックは含めない）。

任意セクションの例

Implementation Notes、Breaking Changes、Screenshots。

## Title 規則

タイトル規則は type:Task のみ適用する。Bug / Feature にはプレフィックスを付けない。

Task で Notion 由来なら `TASK-{N} - {タスク名}` の形式にする。`{N}` は Notion 側の TASK ID（auto_increment_id）。

Task でそれ以外、Bug、Feature は `{要約}` のみでプレフィックスなし。

Notion 側の `TASK-{N}` は Issue type の `Task` とは別概念。Notion 由来の Task 計画にだけ TASK 番号プレフィックスを付ける。

Source の識別（Sentry 由来か Voice 由来か等）はタイトルではなく本文の `## Source` で行う。

## Bug / Feature と Task の連携

Bug / Feature を実装に進めるときは、必ず 1 つ以上の Task に分解して派生させる。1 つの Bug / Feature が複数 Task に分かれることが普通（フェーズ分け、レイヤー分け、ワークスペース分け等）。

派生 Task の作り方

派生 Task の body 冒頭（概要直後）に `Parent: #{親 Bug/Feature 番号}` を書く。

親 Bug / Feature の `## Tasks` に派生 Task 番号を追記する（`- [ ] #N タイトル`）。

派生 Task が close されたら、親の `## Tasks` の対応行を `[x]` に更新する。

親 Bug / Feature の `## Tasks` がすべて `[x]` になったら、親自体を close する。

直接 Task を作る場合（Bug / Feature を経由しない）は `Parent` 行を書かない。これは即計画できる小さい単位用で、Bug / Feature を立てる手間を省けるとき限定。

GitHub Sub-issues 機能を使う場合は body の参照と併用してよい（両方を維持）。

## Assignment

GitHub Issue のアサインを管理する。話しかけた人（`gh api user` の login）を Issue に付け、他の人間 / Claude とのアサイン衝突を避ける。

操作

`mine` は自分にアサインされた open Issue の一覧（`gh issue list --assignee "@me" --state open`）。

`unassigned` は誰にもアサインされていない open Issue の一覧（`gh issue list --search "no:assignee" --state open`）。

`assign {N}` は Issue N を自分にアサイン。

`release {N}` は Issue N の自分のアサインを外す（`gh issue edit N --remove-assignee "@me"`）。

Assign の判定フロー

各 Issue 番号 N について `gh issue view N --json number,title,state,assignees,issueType` を取って判定する。

`state == "CLOSED"` はスキップ（close 済みにアサインしない）。

`assignees` に自分が含まれる場合は already assigned。スキップ。

`assignees` に他人がいる場合は共同アサインするか `AskUserQuestion` で確認。Yes なら `gh issue edit N --add-assignee @me` で共同アサイン。No ならスキップ。

`assignees` が空かつ `issueType.name == "Feature"` の場合は要望集約用なのでアサイン通常不要。`AskUserQuestion` で確認してから実行。

`assignees` が空かつ `issueType.name in ("Bug", "Task", null)` の場合はそのままアサイン。

衝突回避

他人がアサイン中の Issue に無断で自分を追加しない（確認必須）。

close 済み Issue にアサインしない。

同一 Issue を複数の Claude セッションで取り合うのを避けるため、`assign` 実行後にもう一度 `gh issue view` で実際にアサインされたか確認する。失敗していれば再試行せず、ユーザーに状況を報告する。

## ブランチ命名

Issue を実装するブランチは `{issue番号}-{自然な英文}` の形式にする。例: `42-fix-pagination-offset`。
