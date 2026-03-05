# snapshot/

コードから生成するキャッシュ。手で編集しない。docs-snapshotスキルで再生成する。

- features.md: 機能一覧と現在の状態（常に）
- user-flows.md: ユーザー導線。E2Eテストの元ネタ（常に）
- architecture.md: システム構成、外部サービス（外部連携がある場合）
- sitemap.md: ページ/ルート一覧（ルートが多い場合）
- domain-model.md: エンティティと関係（ドメインが複雑な場合）
- api-schema.md: API仕様の要約（APIがある場合）
- components.md: UIコンポーネント一覧（コンポーネントが多い場合）

## ルール

- 手で編集しない。必ずコードから生成する
- 古くなったら丸ごと再生成する。差分更新はしない
- フォーマットの詳細はdocs-snapshotスキルを参照
