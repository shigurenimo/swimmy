import { Database } from "bun:sqlite"
import { z } from "zod"
import { rowDigest } from "@/scripts/migration/prepare-d1"
import { quoteIdentifier } from "@/scripts/migration/postgres-snapshot"

export const verificationSchema = z.object({
  tables: z.array(z.object({ table: z.string(), rows: z.number().int(), sha256: z.string() })),
})

export function verifyD1(path: string, expected: z.infer<typeof verificationSchema>) {
  // workerdのDBを読む際はSQLiteがWAL管理ファイルを作るため、SQL側で書き込みを禁止する。
  const db = new Database(path, { readwrite: true, create: false, strict: true })
  try {
    db.exec("PRAGMA query_only = ON")
    const tables = db
      .query<{ name: string }, []>("SELECT name FROM sqlite_schema WHERE type='table'")
      .all()
      .map((table) => table.name)
      .filter(
        (name) =>
          !name.startsWith("_cf_") && !name.startsWith("sqlite_") && name !== "d1_migrations",
      )
      .sort()
    if (
      JSON.stringify(tables) !== JSON.stringify(expected.tables.map((table) => table.table).sort())
    )
      throw new Error("テーブルの一覧が一致しません")
    for (const table of expected.tables) {
      const rows = db.query(`SELECT * FROM ${quoteIdentifier(table.table)}`).values()
      if (rows.length !== table.rows || rowDigest(rows) !== table.sha256)
        throw new Error(`${table.table}: 件数または内容が一致しません`)
    }
    if (db.query("PRAGMA foreign_key_check").all().length) throw new Error("外部キー違反があります")
    if (JSON.stringify(db.query("PRAGMA integrity_check").values()) !== '[["ok"]]')
      throw new Error("SQLiteの整合性チェックに失敗しました")
    return {
      tables: tables.length,
      rows: expected.tables.reduce((sum, table) => sum + table.rows, 0),
      contents: "match",
      foreignKeys: "ok",
      integrity: "ok",
    }
  } finally {
    db.close()
  }
}

if (import.meta.main) {
  try {
    const [database, expected] = process.argv.slice(2)
    if (!database || !expected)
      throw new Error(
        "使い方: bun scripts/migration/verify-d1.ts <database.sqlite> <verification.json>",
      )
    const parsed = verificationSchema.safeParse(await Bun.file(expected).json())
    if (!parsed.success) throw new Error("照合ファイルの形式が不正です")
    console.log(JSON.stringify(verifyD1(database, parsed.data)))
  } catch (error) {
    console.error(error instanceof Error ? error.message : "照合に失敗しました")
    process.exitCode = 1
  }
}
