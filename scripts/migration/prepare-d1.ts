import { Database } from "bun:sqlite"
import { createHash } from "node:crypto"
import { chmod, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import {
  createBackupDirectory,
  quoteIdentifier,
  type Snapshot,
  snapshotSchema,
} from "@/scripts/migration/postgres-snapshot"

type Table = Snapshot["tables"][number]
type Column = Table["columns"][number]

export function sqlValue(value: string | number | null) {
  if (value === null) return "NULL"
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value)) throw new Error("整数の精度を保持できません")
    return String(value)
  }
  if (value.includes("\0")) throw new Error("SQL内のNULは未対応です")
  return `'${value.replaceAll("'", "''")}'`
}

export function convertValue(column: Column, value: unknown): string | number | null {
  if (value === null) {
    if (!column.nullable) throw new Error(`${column.name}: NOT NULL違反`)
    return null
  }
  if (column.type === "_text") {
    if (!Array.isArray(value) || !value.every((item) => item === null || typeof item === "string"))
      throw new Error(`${column.name}: text[] が不正です`)
    return JSON.stringify(value)
  }
  if (column.type === "timestamp") {
    if (typeof value !== "string" || !/^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d(?:\.\d{1,3})?$/.test(value))
      throw new Error(`${column.name}: ミリ秒精度のUTC日時が必要です`)
    const timestamp = Date.parse(`${value.replace(" ", "T")}Z`)
    if (!Number.isSafeInteger(timestamp)) throw new Error(`${column.name}: 日時が不正です`)
    return timestamp
  }
  if (column.type === "bool") {
    if (typeof value !== "boolean") throw new Error(`${column.name}: boolean が不正です`)
    return Number(value)
  }
  if (column.type === "int4") {
    if (typeof value !== "number" || !Number.isSafeInteger(value))
      throw new Error(`${column.name}: integer が不正です`)
    return value
  }
  if (typeof value !== "string") throw new Error(`${column.name}: text が不正です`)
  return value
}

function columnDefinition(column: Column, enums: Snapshot["enums"]) {
  const name = quoteIdentifier(column.name)
  const enumeration = enums.find((item) => item.name === column.type)
  if (!["text", "timestamp", "bool", "int4", "_text"].includes(column.type) && !enumeration)
    throw new Error(`未対応の型: ${column.type}`)
  const type = ["timestamp", "bool", "int4"].includes(column.type) ? "INTEGER" : "TEXT"
  let definition = `${name} ${type}${column.nullable ? "" : " NOT NULL"}`
  if (column.default !== null) {
    if (column.default === "CURRENT_TIMESTAMP" && column.type === "timestamp")
      definition += " DEFAULT (CAST(unixepoch('subsec') * 1000 AS INTEGER))"
    else if (/^-?\d+$/.test(column.default))
      definition += ` DEFAULT ${sqlValue(Number(column.default))}`
    else if (["true", "false"].includes(column.default))
      definition += ` DEFAULT ${column.default === "true" ? 1 : 0}`
    else {
      const literal = column.default.match(
        /^('(?:[^']|'')*')::(?:text|[A-Za-z_][A-Za-z_0-9]*|"[A-Za-z_][A-Za-z_0-9]*")$/,
      )
      if (!literal) throw new Error(`${column.name}: 未対応のDEFAULT式`)
      definition += ` DEFAULT ${literal[1]}`
    }
  }
  if (column.type === "bool") definition += ` CHECK (${name} IN (0, 1))`
  if (column.type === "_text")
    definition += ` CHECK (${name} IS NULL OR (json_valid(${name}) AND json_type(${name}) = 'array'))`
  if (enumeration)
    definition += ` CHECK (${name} IN (${enumeration.values.map(sqlValue).join(", ")}))`
  return definition
}

export function createSchema(snapshot: Snapshot) {
  const actions: Record<string, string> = {
    a: "NO ACTION",
    r: "RESTRICT",
    c: "CASCADE",
    n: "SET NULL",
    d: "SET DEFAULT",
  }
  const statements: string[] = []
  for (const table of snapshot.tables) {
    const definitions = table.columns.map((column) => columnDefinition(column, snapshot.enums))
    for (const constraint of table.constraints) {
      const columns = constraint.columns.map(quoteIdentifier).join(", ")
      if (constraint.kind === "p") definitions.push(`PRIMARY KEY (${columns})`)
      else {
        if (!constraint.target || !actions[constraint.onUpdate] || !actions[constraint.onDelete])
          throw new Error("未対応の外部キーです")
        definitions.push(
          `FOREIGN KEY (${columns}) REFERENCES ${quoteIdentifier(constraint.target)} (${constraint.targetColumns.map(quoteIdentifier).join(", ")}) ON UPDATE ${actions[constraint.onUpdate]} ON DELETE ${actions[constraint.onDelete]}`,
        )
      }
    }
    statements.push(
      `CREATE TABLE ${quoteIdentifier(table.name)} (\n  ${definitions.join(",\n  ")}\n);`,
    )
  }
  for (const table of snapshot.tables) {
    for (const index of table.indexes)
      statements.push(
        `CREATE ${index.unique ? "UNIQUE " : ""}INDEX ${quoteIdentifier(index.name)} ON ${quoteIdentifier(table.name)} (${index.columns.map(quoteIdentifier).join(", ")});`,
      )
  }
  return statements.join("\n\n")
}

export function rowDigest(rows: unknown[][]) {
  const hashes = rows
    .map((row) => createHash("sha256").update(JSON.stringify(row)).digest("hex"))
    .sort()
  return createHash("sha256").update(hashes.join("\n")).digest("hex")
}

export function insertStatements(prefix: string, row: (string | number | null)[]) {
  const direct = `${prefix} (${row.map(sqlValue).join(", ")});`
  if (Buffer.byteLength(direct) <= 100_000) return [direct]
  if (Buffer.byteLength(JSON.stringify(row)) > 1_900_000)
    throw new Error("D1の行サイズ上限に近い行があります。個別確認が必要です")
  const statements = ["DELETE FROM _swimmy_migration_values;"]
  const values = row.map((value, index) => {
    if (typeof value !== "string") return sqlValue(value)
    // 長文を切り捨てず、Unicodeのコードポイント境界で分けてSQL文の上限内に収める。
    const characters = Array.from(value)
    statements.push(`INSERT INTO _swimmy_migration_values (id, value) VALUES (${index}, '');`)
    for (let offset = 0; offset < characters.length; offset += 16_000) {
      const chunk = characters.slice(offset, offset + 16_000).join("")
      statements.push(
        `UPDATE _swimmy_migration_values SET value = value || ${sqlValue(chunk)} WHERE id = ${index};`,
      )
    }
    return `(SELECT value FROM _swimmy_migration_values WHERE id = ${index})`
  })
  statements.push(`${prefix} (${values.join(", ")});`, "DELETE FROM _swimmy_migration_values;")
  if (statements.some((sql) => Buffer.byteLength(sql) > 100_000))
    throw new Error("D1のSQL文サイズ上限を超えています")
  return statements
}

export async function prepareD1(snapshot: Snapshot, directory: string) {
  const schema = createSchema(snapshot)
  const databasePath = resolve(directory, "database.sqlite")
  const database = new Database(databasePath, { create: true, strict: true })
  await chmod(databasePath, 0o600)
  if (snapshot.tables.some((table) => table.name === "_swimmy_migration_values"))
    throw new Error("移行用のテーブル名が衝突しています")
  const data = [
    "PRAGMA defer_foreign_keys = ON;",
    "CREATE TABLE _swimmy_migration_values (id INTEGER PRIMARY KEY, value TEXT NOT NULL);",
  ]
  const verification = []
  const imageKeys = new Set<string>()
  try {
    database.exec("PRAGMA foreign_keys = ON; BEGIN; PRAGMA defer_foreign_keys = ON;")
    database.exec(schema)
    for (const table of snapshot.tables) {
      const prefix = `INSERT INTO ${quoteIdentifier(table.name)} (${table.columns.map((column) => quoteIdentifier(column.name)).join(", ")}) VALUES`
      const statement = database.prepare(`${prefix} (${table.columns.map(() => "?").join(", ")})`)
      const converted = table.rows.map((row) => {
        if (row.length !== table.columns.length)
          throw new Error(`${table.name}: 列数が一致しません`)
        return table.columns.map((column, index) => {
          const value = convertValue(column, row[index])
          if (column.name === "file_ids" && Array.isArray(row[index]))
            for (const key of row[index]) if (typeof key === "string") imageKeys.add(key)
          if (["header_file_id", "icon_file_id"].includes(column.name) && typeof value === "string")
            imageKeys.add(value)
          return value
        })
      })
      for (const row of converted) {
        statement.run(...row)
        data.push(...insertStatements(prefix, row))
      }
      const actual = database
        .query(
          `SELECT ${table.columns.map((column) => quoteIdentifier(column.name)).join(", ")} FROM ${quoteIdentifier(table.name)}`,
        )
        .values()
      const expectedHash = rowDigest(converted)
      if (actual.length !== converted.length || rowDigest(actual) !== expectedHash)
        throw new Error(`${table.name}: 変換後の照合に失敗しました`)
      verification.push({ table: table.name, rows: actual.length, sha256: expectedHash })
    }
    const foreignKeys = database.query("PRAGMA foreign_key_check").all()
    if (foreignKeys.length) throw new Error(`外部キー違反が ${foreignKeys.length} 件あります`)
    database.exec("COMMIT")
    const integrity = database.query("PRAGMA integrity_check").values()
    if (JSON.stringify(integrity) !== '[["ok"]]')
      throw new Error("SQLiteの整合性チェックに失敗しました")
  } finally {
    database.close()
  }
  data.push("DROP TABLE _swimmy_migration_values;")
  for (const [name, contents] of [
    ["schema.sql", schema],
    ["data.sql", data.join("\n")],
    [
      "verification.json",
      JSON.stringify(
        {
          capturedAt: snapshot.capturedAt,
          tables: verification,
          imageKeys: imageKeys.size,
          foreignKeys: "ok",
          integrity: "ok",
        },
        null,
        2,
      ),
    ],
    ["image-keys.json", JSON.stringify([...imageKeys].sort(), null, 2)],
  ]) {
    if (name && contents)
      await writeFile(resolve(directory, name), contents, { mode: 0o600, flag: "wx" })
  }
  console.log(JSON.stringify({ directory, tables: verification, imageKeys: imageKeys.size }))
}

if (import.meta.main) {
  try {
    const [input, output] = process.argv.slice(2)
    if (!input || !output)
      throw new Error(
        "使い方: bun scripts/migration/prepare-d1.ts <postgres.json> <新しい保存ディレクトリ>",
      )
    const parsed = snapshotSchema.safeParse(await Bun.file(input).json())
    if (!parsed.success) throw new Error("バックアップの形式を検証できませんでした")
    await prepareD1(parsed.data, await createBackupDirectory(output))
  } catch (error) {
    console.error(error instanceof Error ? error.message : "D1変換に失敗しました")
    process.exitCode = 1
  }
}
