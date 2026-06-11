# components.md

UI コンポーネントが多い場合のみ作成する。コンポーネント名と用途だけ並べる。

## いつ作るか

- 自前のコンポーネントが30以上ある
- デザインシステムが独自にあり、外部公開している
- 新規参画者が「どのコンポーネントを使えばいいか」を引きたい

shadcn のような既製ライブラリそのままなら不要。

## フォーマット

```md
# Components

## Layout

- {コンポーネント名}: {用途を1行で}
- {コンポーネント名}: {用途を1行で}

## Form

- ...

## Navigation

- ...

## Feedback

- ...

## Data Display

- ...
```

## ルール

- コンポーネント名と用途を1行で書く
- props、バリアント、スタイルの詳細は書かない（コードと Storybook が source of truth）
- カテゴリで分ける（Layout, Form, Navigation, Feedback, Data Display など）
- 用法のコツや禁止事項は書かない（必要なら個別 ADR か `notes/` へ）
