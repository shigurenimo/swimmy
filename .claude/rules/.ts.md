---
paths: "**/*.{ts,tsx}"
---

# TypeScript Rules

## File Structure

- 1ファイル1関数 or 1クラス
- ファイル名と関数名/クラス名を一致させる (例: `create-user.ts` → `createUser()`)

## Import

- `@/` による絶対パスを使用
- 相対パス (`./`, `../`) 禁止

## Naming

- Use lowercase with hyphens for file names

## Type System

- Use "type" instead of "interface"
- Avoid any type
- No type assertion
- Do NOT use enum

```ts
const user = {} as User // Do NOT use type assertion
const foo = {} as any // Do NOT use any type
```

## Naming Conventions

- Use descriptive naming conventions
- Do NOT abbreviate variable names
- **Method naming**: `with*()` for transformations, `to*()` for outputs, `get*()` for retrieval

## Code Style

### Variables

- Use const whenever possible, avoid let and var
- Do NOT use delete operator
- Do NOT Use destructuring

### Control Flow

- Use for-of loops instead of forEach
- Avoid if-else statements
- Use early returns/continue instead of nested if statements
- Use if statements instead of switch statements
- Do NOT wrap code in `main()` function - use top-level await directly
  - NG: `async function main() { ... } main().catch(console.error)`
  - NG: `async function main() { ... } await main()`
  - OK: Write async code directly at top-level with `await`

### Comments

- Add comments only when function behavior is not easily predictable
- Do NOT use param or return annotations
- Do NOT write comments that repeat class/function names

## Design Principles

### SOLID Principles

- Single Responsibility Principle
- Open-Closed Principle  
- Dependency Inversion Principle

### Functional Programming

- Immutable: Generate new data instead of modifying existing data, with constructor calling Object.freeze(this)
- Referential Transparency: Create pure functions
- Composition: Function composition instead of inheritance
- Separation of Concerns: Separate data transformation, side effects, and business logic

### Refactoring Decision Rules

- **Extract to domain method**: When logic appears in 2+ places
- **Create fluent method**: When manual object manipulation is required
- **Use Service Layer**: When coordinating 3+ related operations
