---
name: claude-notes
description: Troubleshoot development issues and record learnings. Check existing notes for known solutions, record new findings, and track unresolved problems.
---

# 開発ノート管理

開発中の問題解決と知見の蓄積を行う。

## 対象ディレクトリ

- `.claude/notes/` - 解決済みの知見
- `.claude/issues/` - 未解決の問題

## トリガー

以下の状況で発動:

- エラーや予期しない動作に遭遇した
- ライブラリの不具合を発見した
- ワークアラウンドが必要になった
- 開発中に有益な発見をした

## フロー

### 問題に遭遇した場合

**Step 1: 既存のnotesを確認**

```bash
ls .claude/notes/
```

関連するノートがあれば読んで解決策を探す。

**Step 2: 解決策が見つかった場合**

そのノートの内容に従って問題を解決する。

**Step 3: 解決策が見つからない場合**

- 自分で調査して解決を試みる
- 解決できたら notes に記録
- 解決できなかったら issues に記録

### 記録先の判断

| 状況 | 記録先 |
|------|--------|
| 解決済みの知見・ベストプラクティス | notes/ |
| 未解決の問題・バグ | issues/ |

## notes テンプレート

**ファイル名:**

内容がわかる名前にする。

例:
- `tanstack-router-prerender-middleware.md`
- `drizzle-d1-local-setup.md`
- `cloudflare-workers-env-binding.md`

**本文:**

```markdown
# タイトル

## 問題

何が起きていたか。

## 原因

なぜ起きていたか。

## 解決策

どう解決したか。
```

## issues テンプレート

**ファイル名:**

問題を端的に表す名前にする。

**本文:**

```markdown
# 問題のタイトル

## 問題

何が起きているか。

## 再現手順（必要に応じて）

1. ...
2. ...

## ワークアラウンド（あれば）

暫定的な回避策。

## 調査メモ（あれば）

調べたこと、試したこと。
```

## 背景

### なぜ notes と issues を分けるか

- notes: 解決済み → 他の開発者がすぐ参照できる
- issues: 未解決 → 誰かが引き継いで調査できる

### なぜ即座に記録するか

問題を解決したら**すぐに**記録する。後回しにすると忘れる。

```
問題発生 → 調査 → 解決 → 即座に記録
```

### 解決したら issues から notes へ

issues に記録した問題が解決したら:

1. 解決策を notes に記録
2. issues のファイルを削除

### CLAUDE.md との使い分け

| 場所 | 用途 |
|------|------|
| CLAUDE.md の Issues セクション | 重要な問題をシンプルに箇条書き |
| .claude/issues/ | 詳細な調査結果・再現手順・試したこと |

CLAUDE.md は概要、.claude/issues/ は詳細という関係。

## CLAUDE.md への案内追加

notes または issues を新規作成した場合、CLAUDE.md にこれらのディレクトリに関する案内がなければ追加する。

### 確認方法

```bash
grep -E "\.claude/(notes|issues)" CLAUDE.md
```

### 案内がない場合

CLAUDE.md の適切な場所 (Notes セクションの後など) に以下を追加:

```markdown
## Development Notes

- `.claude/notes/` - 解決済みの知見・ベストプラクティス
- `.claude/issues/` - 未解決の問題・調査中の課題
```
