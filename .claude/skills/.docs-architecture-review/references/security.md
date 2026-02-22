# Security Review

## 検出条件

- 認証関連ファイルが存在
  - `src/lib/session.ts`
  - `src/api/routes/auth.*.ts`
  - `src/middlewares/auth.ts`

## 対象ファイル

- `src/lib/session.ts`
- `src/api/routes/auth.*.ts`
- `src/api/middlewares/*.ts`

## レビュー観点

### 認証

- セッション管理が適切か
- JWT の有効期限が適切か
- パスワードハッシュ化が適切か（bcrypt 等）

### 認可

- ロールベースアクセス制御が機能しているか
- 権限チェックが適切な場所で行われているか
- 権限昇格の脆弱性がないか

### 入力検証

- ユーザー入力が適切にサニタイズされているか
- SQL インジェクション対策がされているか
- XSS 対策がされているか

### セッション

- Cookie の設定が適切か（httpOnly, secure, sameSite）
- セッション固定攻撃への対策があるか
- CSRF 対策がされているか

### 機密情報

- 環境変数で機密情報を管理しているか
- ログに機密情報が出力されていないか
- エラーメッセージで内部情報が漏れていないか

## 出力ファイル

`.claude/notes/reviews/security.md`
