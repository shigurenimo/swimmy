---
name: voc
description: "Record customer voice to feedbacks/."
arguments: Voice content. Metadata (who, source) is optional.
---

# Voice

Record customer voices to `.docs/feedbacks/` and attach issue analysis.

## Input

```
/voice {content}
/voice {content} ({who}, {source})
```

If metadata is omitted, use "unknown". Date is auto-filled with today.

## Steps

- Use the `.docs` skill to read index.md and understand the product vision
- Read `.docs/feedbacks/index.md` to grasp existing themes
- Determine if a similar theme exists
  - **Yes**: Read that slug.md, append to `## Voices`, update `## Issues` if needed
  - **No**: Create a new slug.md
- Cross-check against index.md vision, principles, and out-of-scope
  - If the request is outside vision, note it in `## Issues`
- Regenerate `index.md`
- Report analysis briefly

## slug.md format

FrontMatter:

```yaml
---
notion-page-id: {Notion Page ID}
---
```

Body:

```md
# {Theme name}

## Voices
- {Summary of original} [^1]
- {Summary of original} [^2]

## Issues
- {Analyzed issue 1}
- {Analyzed issue 2}

[^1]: "{Original}" ({who}, {YYYY-MM-DD}, {source})
[^2]: "{Original}" ({who}, {YYYY-MM-DD}, {source})
```

Footnotes hold the original text, who, date, and source. Body stays concise with summaries only.

## index.md format

Regenerated from slug.md files. Do not edit manually. Sort by voice count descending.

```md
# Feedbacks

## {Theme name} ({N} voices) [[{slug}]]
{One-line issue summary}

## {Theme name} ({N} voices) [[{slug}]]
{One-line issue summary}. Out of scope
```

## Output example

```
Appended to account-deletion.md (3rd voice).
-> Issue: Missing account deletion flow. Data deletion policy also requested. In scope.
```
