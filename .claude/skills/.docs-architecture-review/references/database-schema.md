# Database Schema Review

## 検出条件

- `src/schema.ts` が存在（Drizzle ORM）
- `prisma/schema.prisma` が存在（Prisma）

## 対象ファイル

- `src/schema.ts`
- `prisma/schema.prisma`
- `drizzle/` ディレクトリ

## レビュー観点

### 正規化と設計

- テーブル間のリレーションが適切か
- 中間テーブルの設計が正しいか
- 冗長なカラムがないか

### 制約とインデックス

- 外部キー制約が設定されているか
- 必要なインデックスがあるか（特にクエリで頻繁に使用されるカラム）
- ユニーク制約が適切か

### 型とNULL許容

- カラムの型が適切か
- NULLable 設計が妥当か
- デフォルト値の設定が適切か

### 一貫性

- 命名規則が統一されているか
- タイムスタンプカラム（createdAt/updatedAt）が一貫しているか
- ID 形式が統一されているか

### 削除時の振る舞い

- ON DELETE 制約の設定状況
- ソフトデリートの必要性

## 出力ファイル

`.claude/notes/reviews/database-schema.md`
