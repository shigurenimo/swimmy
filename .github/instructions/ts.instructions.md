---
applyTo: "**"
---

# TypeScript Rules

## File Organization

### Naming and Structure

- Use lowercase with hyphens
- Define only one function or class or type per file
- Do not use multiple exports in a single file
- Delete unnecessary files
- Do NOT make index.ts files

### Special Files (Multiple Exports Allowed)

Multiple variables and types can be exported in these files:

- **/constants.ts - Constant definitions
- **/models.ts - Model definitions
- **/types.ts - Type definitions
- **/utils.ts - Utility functions

## Type System

- Use "type" instead of "interface"
- Avoid any type
- No type assertion
- Do NOT use enum

\`\`\`ts
const user = {} as User // Do NOT use type assertion
const foo = {} as any // Do NOT use any type
\`\`\`

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
- Use early returns instead of nested if statements
- Use if statements instead of switch statements

### Comments

- Add comments only when function behavior is not easily predictable
- Do NOT use param or return annotations

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

## Language Constructs

### Functions

- When multiple arguments are needed, use an object named "props" with a defined "Props" type
- Prefer pure functions
- Use immutable data structures
- Isolate side effects
- Ensure type safety

\`\`\`ts
type Props = {}

/**
 * Name
 */
export function FunctionName(props: Props) {
  // props.prop1 // Use props directly
  // const { prop1, prop2 } = props // Do NOT use destructuring
}
\`\`\`

### Classes

- Do NOT define classes with only static members
- Avoid class inheritance
- Make classes immutable
- Do NOT explicitly write public modifier
- Use getters actively instead of defining getXxx methods
- Do not define return types for getter methods
- All properties must be readonly
- Constructor must call Object.freeze(this) for immutability

\`\`\`ts
type Props = {}

/**
 * Class Name
 */
export class ClassName {
  constructor(private readonly props: Props) {
    Object.freeze(this)
  }

  /**
   * Public method description
   */
  method() {
    // method implementation
  }
}
\`\`\`

## Design Patterns

### Fluent API Pattern

- **Method Chaining**: Enable natural, readable operation sequences
- **Immutability**: Return new objects instead of modifying existing ones

\`\`\`ts
export class Document {
  constructor(private readonly data: Data) {}
  
  withTitle(title: string): Document {
    return new Document({ ...this.data, title })
  }
  
  toMarkdown(): string {
    return this.format()
  }
}

// ✅ Recommended: Fluent API with method chaining
const result = document.withTitle("New").withAuthor("John").toMarkdown()

// ❌ Avoid: Imperative mutations
document.setTitle("New")
const result = document.getMarkdown()
\`\`\`

### Service Layer Pattern

- **Centralized Coordination**: Coordinate multiple domain objects and external resources

\`\`\`ts
export class DocumentService {
  constructor(
    private readonly fileSystem: FileSystem,
    private readonly parser: Parser,
    private readonly validator: Validator
  ) {}

  async process(path: string): Promise<Document> {
    const content = await this.fileSystem.read(path)
    const parsed = this.parser.parse(content)
    return new Document(this.validator.validate(parsed))
  }
}
\`\`\`

### Facade Pattern

- **Unified Interface**: Hide complexity behind simple methods

\`\`\`ts
export class DocumentFacade {
  async get(path: string): Promise<Document> {
    const content = await this.readFile(path)
    const parsed = this.parse(content)
    const validated = this.validate(parsed, await this.getSchema(path))
    return new Document(validated)
  }
}
\`\`\`

### Other Patterns

- **Factory Method**: Create objects without specifying exact classes
- **Adapter**: Allow incompatible interfaces to work together
- **Builder**: Construct complex objects step by step

## Programming Paradigms

### Domain-Driven Design

- **Value Objects**: Immutable objects defined by their attributes
- **Entities**: Objects with identity that persists over time
- **Aggregate Root**: Entry point to an aggregate of objects

### Functional Programming

- **Reducer**: Accumulate values through iteration
- **Early Return**: Exit functions as soon as result is determined
- **Dependency Injection**: Provide dependencies from external sources

## Pattern Guidelines

### Domain Logic Encapsulation

\`\`\`ts
// ✅ Recommended: Logic encapsulated in domain object
const updatedDocument = document.withProperties(newProperties)
const markdown = updatedDocument.toMarkdown()

// ❌ Avoid: Manual operations scattered in calling code
const merged = { ...document.properties, ...newProperties }
const formatted = formatMarkdown(merged, document.content)
\`\`\`

### Separation of Concerns

\`\`\`ts
// ✅ Recommended: Clear separation of concerns
const validated = validator.validate(data)
const transformed = transformer.transform(validated)
const saved = await repository.save(transformed)

// ❌ Avoid: Mixed concerns in single function
async function processData(data) {
  // validation logic mixed with transformation
  if (!data.name) throw new Error()
  data.name = data.name.toUpperCase()
  // business logic mixed with persistence
  await db.save(data)
  return data
}
\`\`\`
