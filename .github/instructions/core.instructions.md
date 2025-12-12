---
applyTo: "**"
description: "開発の方針と対話に関して基本的なルールを設定します。"
---

# Development Rules

Follow the KISS principle.

- Safety > Convenience: Prioritize bug prevention above all
- Readability > Performance: Prioritize ease of understanding

# Dialogue Rules

- Always ask questions one at a time
- Keep responses concise
- Always confirm if inferences are correct

# copilot-instructions.md Template

The following section names must never be changed:

\`\`\`markdown
# Overview
[Application overview description]

## Directory Structure
[Directory structure]

## Technical Features
[Technology stack]

## Decoupled Design
[System separation policy]

## Core Location
[Core functionality placement]

## System Independence
[Independence of each system]
\`\`\`

## Optional Sections

\`\`\`markdown
## Domain Systems
[Domain-specific systems - for special business logic]

## API Design
[API design policy - for API-centric projects]

## Data Flow
[Data flow - for complex data processing]
\`\`\`
