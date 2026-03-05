---
name: backlog
description: Analyze and plan product backlogs with vision alignment.
arguments: Issue description, feedbacks/ slug, or backlogs/ slug.
---

Record issues in `.docs/backlogs/`, aligning with product.md.

See docs skill references/backlogs.md for format.

## Arguments

```
/backlog {issue description}
/backlog {feedbacks/ slug}
/backlog {slug} (update existing)
```

## Skills and plugins

Invoke via the Skill tool.

- plan-backlog: Discuss and draft backlog content.
- docs: `.docs/` format and rules.
- issue: Investigate and plan GitHub Issues.

## Workflow

- Read `.docs/product.md`
- Read `.docs/backlogs/index.md` to check existing backlogs
- Interpret input:
  - feedbacks/ slug: read feedbacks/{slug}.md and link as background
  - Issue text: treat as a new issue
  - Existing backlogs/ slug: update the existing file
- Discuss against product.md (see Discussion flow)
- Use plan-backlog skill to draft content from the discussion result
- Create or update slug.md with the returned content
- Regenerate `index.md`
- Ask the user whether to proceed with Issue creation
  - Proceed: invoke the issue skill
  - Stop: end the workflow

## Discussion flow

- Report vision alignment first
- Ask questions if needed (technical feasibility, priority rationale, impact scope)
- Suggest what to investigate if research is needed
- Propose multiple options (never narrow to one)
- Human makes the decision. Claude provides the materials.
