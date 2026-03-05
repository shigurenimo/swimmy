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
  glossary.md             # 共通用語(手で管理)
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

複数製品の場合、product.md / feedbacks/ / backlogs/ / decisions/ / snapshot/ は各製品ディレクトリの下に配置する。glossary.md と notes/ は共通。
