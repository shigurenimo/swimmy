---
name: backlog
description: "?"
user-invocable: true
disable-model-invocation: false
metadata:
  author: shigurenimo
  description: `.docs/backlogs/` に課題を記録・更新するスキル。feedbacks/ から新規バックログ候補も提案できる。
  dev: true
---

Record issues in `.docs/backlogs/`, aligning with index.md.

See docs skill references/backlogs.md for format.

## Arguments

```
/backlog                (propose candidates from feedbacks/)
/backlog {issue description}
/backlog {feedbacks/ slug}
/backlog {slug} (update existing)
```

## Skills and plugins

Invoke via the Skill tool.

- `backlog-planning`: Discuss and draft backlog content.
- `docs`: `.docs/` format and rules.
- `issue`: Investigate and plan GitHub Issues.
- `voc`: Read feedbacks/ for customer voices.

## Workflow

### When no arguments (propose mode)

- Read `.docs/index.md` to understand the product vision, values, and direction
- Read `.docs/backlogs/index.md` to check existing backlogs
- Read all `.docs/feedbacks/` files that are NOT already in backlogs/
- Evaluate each unregistered feedback against:
  - Vision alignment (does it serve the product's stated purpose?)
  - Value axis match (which of the product's stated values does it serve?)
  - Strategic direction fit (does it align with current priorities like renewal themes?)
  - Structural problem relevance (does it address known structural issues?)
  - Voice count (more voices = stronger signal)
- Exclude feedbacks that fall under "やらないこと" in index.md
- Present candidates grouped by recommendation:
  - Develop: high vision alignment + strategic fit
  - Investigate: vision-aligned but needs research
  - Skip: vision-misaligned or out of scope
- For each candidate, show: theme name, vision axis, rationale (1 line)
- Ask the user which candidates to proceed with
- For approved candidates, run the standard workflow (below) in batch

### When arguments provided (standard mode)

- Read `.docs/index.md`
- Read `.docs/backlogs/index.md` to check existing backlogs
- Interpret input:
  - feedbacks/ slug: read feedbacks/{slug}.md and link as background
  - Issue text: treat as a new issue
  - Existing backlogs/ slug: read it and parse `---` zone separator before updating
- Discuss against index.md (see Discussion flow)
- Use `backlog-planning` skill to draft content from the discussion result
- Create or update slug.md with the returned content
  - 既存ファイルを更新するときは `---` から下の Claude ゾーンのみ書き換える。`---` から上の人間ゾーンは触らない
  - 新規作成時は `# {テーマ名}` の直下に空の人間ゾーンと `---` 分離線を置き、その下に Claude ゾーンを書く
  - フォーマット詳細は `.claude/skills/docs/references/backlogs.md` を参照
- Ask the user whether to proceed with Issue creation
  - Proceed: invoke the `issue` skill
  - Stop: end the workflow

Do not touch `index.md`. Regenerating `index.md` is handled by the separate `backlogs-index` skill.
Do not touch the human zone (above `---`). Only rewrite the Claude zone (below `---`).

## Discussion flow

- Report vision alignment first
- Ask questions if needed (technical feasibility, priority rationale, impact scope)
- Suggest what to investigate if research is needed
- Propose multiple options (never narrow to one)
- Human makes the decision. Claude provides the materials.
