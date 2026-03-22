# ディレクトリ構造

単一製品の場合:

```
.docs/
  product.md
  glossary.md
  feedbacks/
  backlogs/
  decisions/
  snapshot/
  notes/
```

複数製品の場合:

```
.docs/
  index.md                # 事業全体のコンテキスト
  glossary.md             # 共通用語
  metrics.md              # KGI/KPI定義と計測ステータス
  notes/                  # 共通メモ
  products/
    {product-a}/
      product.md
      feedbacks/
      backlogs/
      decisions/
      snapshot/
    {product-b}/
      product.md
      feedbacks/
      backlogs/
      decisions/
      snapshot/
```

複数製品の場合、トップレベルの index.md は事業全体を理解するためのコンテキストを提供する。product.md / feedbacks/ / backlogs/ / decisions/ / snapshot/ は各製品ディレクトリの下に配置する。glossary.md / metrics.md / notes/ は共通。
