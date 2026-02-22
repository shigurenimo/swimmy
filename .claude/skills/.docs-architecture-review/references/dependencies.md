# Dependencies Review

## 検出条件

- `package.json` が存在

## 対象ファイル

- `package.json`
- `package-lock.json` / `bun.lockb`

## レビュー観点

### 依存関係の健全性

- 不要な依存関係がないか
- 重複した機能を持つパッケージがないか
- devDependencies と dependencies の分類が適切か

### バージョン管理

- メジャーバージョンが古すぎないか
- セキュリティ脆弱性のあるバージョンを使用していないか
- バージョン指定が適切か（^, ~, 固定）

### バンドルサイズ

- 重いパッケージが含まれていないか
- 軽量な代替パッケージがあるか
- Tree-shaking が効くパッケージを選んでいるか

### TypeScript 型定義

- 必要な @types/* パッケージがあるか
- 型定義が内蔵されているパッケージは @types/* が不要か

### 整合性

- フレームワークのバージョンが互換性を持っているか
- peer dependencies が満たされているか

## 出力ファイル

`.claude/notes/reviews/dependencies.md`
