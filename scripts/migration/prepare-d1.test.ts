import { Database } from "bun:sqlite"
import { afterEach, expect, test } from "bun:test"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import {
  convertValue,
  createSchema,
  insertStatements,
  prepareD1,
  sqlValue,
} from "@/scripts/migration/prepare-d1"
import type { Snapshot } from "@/scripts/migration/postgres-snapshot"
import { verificationSchema, verifyD1 } from "@/scripts/migration/verify-d1"

const directories: string[] = []
afterEach(async () => {
  for (const directory of directories.splice(0)) await rm(directory, { recursive: true })
})

const snapshot: Snapshot = {
  version: 1,
  capturedAt: "2026-09-06T00:00:00.000Z",
  databaseBytes: "0",
  serverVersion: "15.5",
  enums: [{ name: "role", values: ["USER", "ADMIN"] }],
  tables: [
    {
      name: "posts",
      columns: [
        { name: "id", type: "text", nullable: false, default: null },
        { name: "reply_id", type: "text", nullable: true, default: null },
        { name: "created_at", type: "timestamp", nullable: false, default: "CURRENT_TIMESTAMP" },
        { name: "file_ids", type: "_text", nullable: true, default: null },
        { name: "is_deleted", type: "bool", nullable: true, default: "false" },
        { name: "text", type: "text", nullable: true, default: null },
        { name: "role", type: "role", nullable: false, default: "'USER'::role" },
      ],
      constraints: [
        {
          name: "posts_pkey",
          kind: "p",
          columns: ["id"],
          target: null,
          targetColumns: [],
          onUpdate: " ",
          onDelete: " ",
        },
        {
          name: "posts_reply_fkey",
          kind: "f",
          columns: ["reply_id"],
          target: "posts",
          targetColumns: ["id"],
          onUpdate: "c",
          onDelete: "n",
        },
      ],
      indexes: [
        {
          name: "posts_date_idx",
          unique: false,
          columns: ["created_at"],
          method: "btree",
          predicate: null,
          options: [0],
          includes: false,
        },
      ],
      rows: [
        [
          "child",
          "parent",
          "2026-09-06 00:00:00.123",
          ["../画像", "a'b"],
          false,
          "日本語🙂\nO'Reilly; SELECT 1;",
          "USER",
        ],
        ["parent", null, "2016-12-25 10:23:51", null, null, "", "ADMIN"],
        ["empty-array", null, "2026-09-06 00:00:00", [], true, null, "USER"],
      ],
    },
  ],
}

test("D1 conversion preserves values and imports references without spanning transactions", async () => {
  const directory = await mkdtemp(join(tmpdir(), "swimmy-d1-test-"))
  directories.push(directory)
  await prepareD1(snapshot, directory)
  const expected = verificationSchema.parse(
    await Bun.file(join(directory, "verification.json")).json(),
  )
  expect(verifyD1(join(directory, "database.sqlite"), expected).contents).toBe("match")
  const db = new Database(join(directory, "database.sqlite"))
  try {
    db.exec("PRAGMA foreign_keys = ON")
    expect(
      db.query("SELECT created_at,file_ids,is_deleted,text FROM posts WHERE id='child'").values(),
    ).toEqual([[1788652800123, '["../画像","a\'b"]', 0, "日本語🙂\nO'Reilly; SELECT 1;"]])
    expect(
      JSON.stringify(
        db.query("SELECT file_ids,is_deleted,text FROM posts WHERE id='parent'").values(),
      ),
    ).toBe(JSON.stringify([[null, null, ""]]))
    expect(
      JSON.stringify(
        db.query("SELECT file_ids,is_deleted,text FROM posts WHERE id='empty-array'").values(),
      ),
    ).toBe(JSON.stringify([["[]", 1, null]]))
    expect(() => db.exec("UPDATE posts SET role='INVALID' WHERE id='child'")).toThrow()
    expect(() => db.exec("UPDATE posts SET is_deleted=2 WHERE id='child'")).toThrow()
    db.exec("DELETE FROM posts WHERE id='parent'")
    expect(() => verifyD1(join(directory, "database.sqlite"), expected)).toThrow("一致しません")
    expect(JSON.stringify(db.query("SELECT reply_id FROM posts WHERE id='child'").values())).toBe(
      "[[null]]",
    )
    const imported = new Database(":memory:")
    try {
      imported.exec("PRAGMA foreign_keys = ON")
      imported.exec(await Bun.file(join(directory, "schema.sql")).text())
      imported.exec(await Bun.file(join(directory, "data.sql")).text())
      expect(imported.query("SELECT count(*) FROM posts").values()).toEqual([[3]])
      expect(imported.query("PRAGMA foreign_key_check").all()).toEqual([])
    } finally {
      imported.close()
    }
  } finally {
    db.close()
  }
})

test("conversion rejects precision loss and unknown SQL types", () => {
  const column = { name: "created_at", type: "timestamp", nullable: false, default: null }
  expect(() => convertValue(column, "2026-09-06 00:00:00.123456")).toThrow()
  expect(() => convertValue(column, "infinity")).toThrow()
  expect(() => sqlValue(Number.MAX_SAFE_INTEGER + 1)).toThrow()
  const altered = structuredClone(snapshot)
  const first = altered.tables[0]?.columns[0]
  if (!first) throw new Error("fixture missing")
  first.type = "numeric"
  expect(() => createSchema(altered)).toThrow("未対応の型")
})

test("long Unicode text passes through SQL files within D1 statement limits", () => {
  const text = "🙂'漢;\n".repeat(17_000)
  const statements = insertStatements("INSERT INTO posts (id,text) VALUES", ["large", text])
  expect(statements.every((sql) => Buffer.byteLength(sql) <= 100_000)).toBe(true)
  const db = new Database(":memory:")
  try {
    db.exec(
      "CREATE TABLE posts (id TEXT PRIMARY KEY, text TEXT); CREATE TABLE _swimmy_migration_values (id INTEGER PRIMARY KEY, value TEXT NOT NULL)",
    )
    for (const sql of statements) db.exec(sql)
    expect(db.query("SELECT text FROM posts WHERE id='large'").values()).toEqual([[text]])
  } finally {
    db.close()
  }
})
