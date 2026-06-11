# 検証基準

定期的にサブエージェントで矛盾を検出し、ユーザーと一緒に直す。

## 構造

- ディレクトリ構造がスキルの定義と一致しているか
- index.md が肥大化していないか（100行以下）。超えた場合に value.md / capabilities.md / milestones.md などへ切り出されているか
- index.md のセクション構造が守られているか
- value.md と index.md の「解決する問題」セクションが重複していないか（index は1段落のリード、value は本体）
- integrations.md と architecture.md の役割が混ざっていないか（integrations は業務上のデータ流通、architecture は内部構成）
- stories/ と user-flows.md が役割重複していないか（stories はロール横断の物語、user-flows は1ロール1導線のステップ）

## コード生成ファイル

- features がコードの実態と一致しているか
- 機能数が多くなったとき features.md 単一から features/ 分割へ移行しているか
- features/ のファイル名命名規則（slug 規則 / 番号プレフィックス規則）がプロジェクト内で統一されているか。混在していないか
- sitemap.md の URL がルート実装と一致しているか
- architecture.md がランタイム・レンダリング・データ取得など製品で使う技術と整合しているか
- roles-and-permissions.md がコードの認可ヘルパ宣言と一致しているか
- domain.md のテーブル数とカテゴリ分けがスキーマと整合しているか
- snapshot/ や生成物ディレクトリ（例: html/）が手で編集されていないか

## frontmatter 連携

- features/{slug}.md の `slug` がファイル名と一致しているか
- features/{slug}.md の `milestone:` が milestones.md の日付セクションと一致しているか
- 廃止された `priority: must/nice` が残っていないか

## ADR と意思決定

- decisions/ の各 ADR に4セクション（状況、判断、理由、結果）があるか
- decisions/ の理由に却下した選択肢が書かれているか
- 重要な決定の根拠が sources/minutes/ から逆リンクされているか

## 声とバックログ

- signals/ の各 slug.md に声の原文が保持されているか
- signals/index.md が slug.md と一致しているか
- backlogs/ の判断が「開発する」のものに対応する ADR が存在するか
- backlogs/index.md が slug.md と一致しているか
- 人間ゾーンと Claude ゾーンの `---` 境界が守られているか

## 用語

- glossary.md の用語とコードの命名が一致しているか
- references/terms/ の各ファイルが2〜6行に収まっているか
- 機能（製品固有）が terms に流出していないか

## リンクとグラフ

- 孤立ノード（どこからもリンクされず、どこへもリンクしないファイル）が無いか
- wikiリンク `[[]]` が使われているか（Markdown リンクが混入していないか）
- 未解決リンクが「次に書くべきノード」として認識されているか
