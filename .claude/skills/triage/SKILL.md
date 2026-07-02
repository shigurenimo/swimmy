---
name: triage
description: Single entry point that reads any input and routes it to signal / backlog / issue / existing issue or PR follow-up, then carries it through to implementation.
when_to_use: Whenever you receive an input whose destination is undecided (customer voices, ideas, work requests, numbers, URLs). Implementation phases run through here too.
user-invocable: true
disable-model-invocation: false
model: claude-opus-4-6[1m]
effort: xhigh
metadata:
  type: task
  author: shigurenimo
  description: 入力の粒度と当事者性を判定し、signal / backlog / issue / 既存 issue or PR の続き作業へルーティングする入口スキル。実装フェーズ（Branch / Code / Verification / Debug / PR 作成）も内包する。書式は docs と gh-issue-template に委ねる。
  design: 入力を分類して記録先へ振り分け計画から実装やレビューや PR まで通す入口スキル。ルーティング判断とコード実装を内包するため品質を優先する。
  dev: true
  tools: gh, playwright, agent-browser
  tags: [tools]
---

何かしたい時に投げる単一の入口。入力を読み、行き先を決めて記録し、必要なら実装まで進める。書式は `gh-issue-template` と `docs` が正本なのでここには書かない。

## Arguments

```
/triage {何でも}
```

引数の例

数字や `#N` を含むときは既存 Issue / PR の続き作業として扱う。

GitHub の Issue / PR URL は同上。

`feedbacks/{slug}` や `signals/{slug}` のパスは既存記録の更新・昇格として扱う。

それ以外の自然文は中身を読んでルーティングする。

引数なしのときは backlog の Propose モードに振る（feedbacks から候補を提案する）。

## ルーティング判定

入力の粒度と当事者性で行き先を決める。

### signal に振る

主語が「お客さんが」「〇〇さんが言ってた」のような観察報告。誰がやるか・何をやるかは未定。

例「求人検索の絞り込みが効かないって細川さんが言ってた」「経営者向けの画面が分かりにくいと福岡の顧客から複数声が来てる」

書式と保存場所は `docs` の signals 規約に従う。

### backlog に振る

主語が「〜したい」「〜できたらいい」のような自分・チームの発想。粒度は大きく、まだ実装に落ちない。

例「求人一覧にお気に入り機能つけたい」「経営者向けダッシュボードを作りたい」

書式と保存場所は `docs` の backlogs 規約に従う。

### issue に振る

「〜を直す」「〜を作る」のような着手できる具体的な作業。やる人とやることが明確。

例「求人一覧で1ページ目だけお気に入りボタンが効かないバグ修正」「TASK-1234 を実装する」

Bug / Feature / Task の選び方、Title 規則、Assignment、`.github/*_TEMPLATE.md` の優先順位は `gh-issue-template` に従う。

### 既存 Issue / PR の続き作業に振る

数字、`#N`、GitHub URL を含む入力。下記「Workflow: 番号系」を参照。

## 曖昧な時の振る舞い

判定に迷う粒度（声とも backlog ともとれる、backlog とも issue ともとれる）は勝手に振らない。「これは X として扱います、よければそのまま、違えば Y / Z」と提示してから振る。判定理由を1行で添える。

## Workflow: 自然文系

Classify

入力を読んで signal / backlog / issue のどれかに分類する。迷う場合は候補を提示してユーザーに確認する。

Discuss（issue / backlog のとき）

書き込む前に方針を議論する。Vision alignment（製品の方向性に合うか）を最初に報告し、必要なら追加で質問する（技術的実現性、優先度の根拠、影響範囲）。調査が要るなら何を調べるか提案する。**複数の選択肢を提示し、1案に絞らない**。最終判断は人間が行う。Claude は材料を出す側に徹する。

Record

signal なら `docs` の signals 規約に従って記録する。`.docs/index.md` を先に読んでビジョンと整合チェックする。類似テーマがあれば該当 slug.md の Claude ゾーンに追記、無ければ新規 slug.md を作成する。ビジョン外なら `## 課題` セクションにその旨を明記する。`index.md` は触らない（再生成手順は `docs` の signals.md に記載）。

backlog なら `docs` の backlogs 規約に従って記録する。`.docs/index.md` と `.docs/backlogs/index.md` を先に読む。入力が feedbacks/ slug ならその内容を背景としてリンクする。既存 backlogs/ slug を指定された場合は `---` ゾーン分離を解析し、Claude ゾーンのみ書き換える。新規作成時は人間ゾーンを空のまま `---` を置く。`index.md` は触らない。

issue なら `gh-issue-template` の Bug / Feature / Task 判定と Template に従って `gh issue create` する。重複は `gh issue list` で先にチェックする。issue として記録した後、ユーザーが実装に進みたいなら「Workflow: 番号系」に合流する。

Promote

signal や backlog として記録したものを後で issue に昇格させたい場合は、`/triage {slug}` で該当 slug を指定し、再分類で issue を選ぶ。元の signal / backlog は残し、issue 本文の Source 行に元 slug を `[[signals/{slug}]]` または `[[backlogs/{slug}]]` で記録する。

## Workflow: 番号系（Issue 取得から PR まで）

入力が数字や URL の場合、または自然文系から issue 起票後に実装へ進む場合。

Inspect

`gh issue view {N}` で本文を取得し、`## Plan` セクションが埋まっているか判定する。

`gh pr list --search "{N} in:body" --state all --json number,title,state,headRefName,isDraft` で紐づく PR を検索する。

結果をユーザーに提示してから分岐する。既存 PR ありなら「既存 PR に乗る / 新規 PR を作る」を確認。乗る場合は Plan をスキップして Branch に進む。既存 PR なし＋既存 Plan ありなら「使う / 更新する / 作り直す」を確認。既存 PR なし＋既存 Plan なしなら Plan に進む。

Plan

技術計画を作成し Issue body に書き込む。書式は `gh-issue-template` の Task Template に従う。計画はコードベースを読んで影響範囲を把握してから作成する。下記「Plan の skip 基準」に該当する場合は計画できない旨を返してユーザーに判断を委ねる。

「作り直す」ならフル再生成して上書き。「更新する」なら差分のみ反映。「使う」ならスキップ。

Report

計画と PR 状況をユーザーに提示し、実装に進むか確認する。進めるなら Branch へ。止めるならワークフロー終了。

Branch

`{issue番号}-{自然な英文}` のブランチを切る。例 `42-fix-pagination-offset`。既存 PR に乗る場合は `gh pr checkout {pr番号}` でチェックアウトする。

Code

Issue のタスクリストに沿って実装する。タスクを完了したらチェックを入れる。適宜コミットする。

Security（任意）

ユーザー入力、認証、データ処理に関わる変更がある場合、`hacker` を Team に追加してセキュリティテストを行う。該当しない変更ではスキップする。

Verification

変更内容のチェックリストを作成し、実動作を確認する。

ブラウザで動く機能は `playwright-agent` を3名並列で Team に追加し、別テストファイルを分担させて `bunx playwright test` が通るまで修正させる。

それ以外は `agent-browser` や実コマンド実行で動作確認する。

UI 差分がある PR では、`inta tools images` と `agent-browser` が両方使える環境のみ、PR 本文に before / after のスクショを必ず貼る。手順は `references/screenshot-upload.md` を参照。

全項目パスしてから次に進む。

Debug

`debugger` を Team に追加して変更をレビューする。軽微な問題はその場で修正、重大な指摘は次の Triage に回す。

Triage（debugger 指摘の振り分け）

debugger の指摘をユーザーに提示し、対応を確認する。軽微なものはその場で修正してコミットする。計画が必要なものは新しい Issue を作成する（このスキルの「Workflow: 自然文系」に戻る）。

Pull Request

commit-commands:commit-push-pr でプッシュして PR を作成する。PR 本文は `gh-issue-template` の PR Template に従う。

## Team

lead（本体）が司令塔として常駐し、実装中は必要に応じてサブエージェントをメンバー化して委任する。

Playwright generator は `playwright-agent`。ブラウザ上で動く機能を変更した場合に追加する。3名並列で別テストファイルを分担させてテストを生成する。

Debugger は `debugger`。実装完了後の Debug phase で毎回起動し、変更をレビューさせる。

Hacker は `hacker`。ユーザー入力・認証・データ処理に関わる変更がある場合のみ Security phase で起動する。

playwright-agent が未インストールの場合

`.claude/agents/playwright-*.md` や `@playwright/cli` がプロジェクトに無ければ、実装に入る前に `bootstrap` スキルで Playwright と playwright-agent を導入する。導入後、生成された agent を Team のメンバーとして追加してから進める。

## Workflow: 引数なし（Propose モード）

`/triage` 単独で呼ばれた場合は backlog 候補の Propose モードに入る。

手順

`.docs/index.md` を読み、製品のビジョン、価値軸、戦略的方向性を把握する。

`.docs/backlogs/index.md` を読み、既存バックログを確認する。

`.docs/feedbacks/` 配下のうち、まだ backlogs に登録されていないファイルを全て読む。

各 feedback を次の基準で評価する。

ビジョン整合（製品の掲げる目的に資するか）。

価値軸との一致（製品が掲げる価値のどれに資するか）。

戦略方向との適合（現在の優先度、リニューアルテーマ等に合うか）。

構造的問題との関連（既知の構造的課題に対応するか）。

声の数（声が多いほど信号が強い）。

`.docs/index.md` の「やらないこと」に該当する feedback は除外する。

候補を推奨度でグループ化して提示する。

Develop（ビジョン整合と戦略適合が高い）。

Investigate（ビジョン整合はあるが要調査）。

Skip（ビジョン外、スコープ外）。

各候補にテーマ名、ビジョン軸、1行の根拠を添える。

ユーザーがどれを進めるか確認する。承認された候補に対して「Workflow: 自然文系」の Discuss → Record（backlog）をバッチで実行する。

## Plan の skip 基準

「Workflow: 番号系」の Plan フェーズで、次の場合は計画できない旨を返してユーザーに判断を委ねる。

要件が曖昧で複数の解釈がある。

外部サービスや環境の情報が不足している。

別の Issue に依存している。

技術的な不明点が多くリスクが高い。

`Plan` フェーズの計画作成自体はコードベースを読み `gh-issue-template` の Task Template に従ってテキストを組み立てる。GitHub への書き込みは Plan フェーズの最後に1回だけ行う。

## やらないこと

書式の定義はしない。Issue / PR の Template、必須セクション、Title 規則、Assignment、ブランチ命名、`.github/*_TEMPLATE.md` の優先順位は `gh-issue-template` を参照する。signals / backlogs / decisions の書式と保存場所は `docs` を参照する。

勝手にルーティングしない。判定に迷うときはユーザーに確認する。理由を添える。

## Skills and plugins

Invoke via the Skill tool.

- `gh-issue-template`: Issue / PR を書く時のテンプレートと運用ルール（書式の正本）。
- `docs`: `.docs/` の構造と signals / backlogs / decisions の書式（書式の正本）。
- `bootstrap`: Playwright と playwright-agent の導入。
- `agent-browser`: Browser automation for verification.
- `commit-commands`: Commit, push, and open PRs.
- `pr-review-toolkit`: Review code quality, tests, types, and comments.
- `superpowers`: Spawn parallel agents, create plans, review code.
- `feature-dev`: Investigate codebase and assess impact.
- `frontend-design`: Design UI components and pages.
