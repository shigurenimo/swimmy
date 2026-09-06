import { chmod, mkdir, writeFile } from "node:fs/promises"
import { resolve, sep } from "node:path"
import { Client, types } from "pg"
import { z } from "zod"

export const snapshotSchema = z.object({
  version: z.literal(1),
  capturedAt: z.string(),
  databaseBytes: z.string(),
  serverVersion: z.string(),
  enums: z.array(z.object({ name: z.string(), values: z.array(z.string()) })),
  tables: z.array(
    z.object({
      name: z.string(),
      columns: z.array(
        z.object({
          name: z.string(),
          type: z.string(),
          nullable: z.boolean(),
          default: z.string().nullable(),
        }),
      ),
      constraints: z.array(
        z.object({
          name: z.string(),
          kind: z.enum(["p", "f"]),
          columns: z.array(z.string()),
          target: z.string().nullable(),
          targetColumns: z.array(z.string()),
          onUpdate: z.string(),
          onDelete: z.string(),
        }),
      ),
      indexes: z.array(
        z.object({
          name: z.string(),
          unique: z.boolean(),
          columns: z.array(z.string()),
          method: z.literal("btree"),
          predicate: z.null(),
          options: z.array(z.literal(0)),
          includes: z.literal(false),
        }),
      ),
      rows: z.array(z.array(z.unknown())),
    }),
  ),
})

export type Snapshot = z.infer<typeof snapshotSchema>

export function quoteIdentifier(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}

export async function createBackupDirectory(path: string) {
  const directory = resolve(path)
  const repository = resolve(import.meta.dir, "../..")
  if (directory === repository || directory.startsWith(`${repository}${sep}`)) {
    throw new Error("実データの保存先にはリポジトリ外の新しいディレクトリを指定してください")
  }
  await mkdir(directory, { mode: 0o700 })
  return directory
}

export async function exportPostgres(directory: string) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL が必要です")
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 15_000,
    options: "-c default_transaction_read_only=on -c statement_timeout=60000 -c timezone=UTC",
    types: {
      getTypeParser: (oid, format) =>
        oid === 1114 ? (value: string) => value : types.getTypeParser(oid, format),
    },
  })
  try {
    await client.connect()
    await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY")
    const tables = (
      await client.query<{ name: string }>(`
      SELECT tablename AS name FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename
    `)
    ).rows
    if (!tables.length) throw new Error("public にテーブルがありません")
    await client.query(
      `LOCK TABLE ${tables.map((table) => `public.${quoteIdentifier(table.name)}`).join(", ")} IN ACCESS SHARE MODE`,
    )
    const extraObjects = await client.query(`
      SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relkind NOT IN ('r', 'i', 'S')
      UNION ALL SELECT trigger_name FROM information_schema.triggers WHERE trigger_schema = 'public'
    `)
    if (extraObjects.rowCount)
      throw new Error("未対応のビュー・トリガーなどがあります。個別の移行が必要です")
    const info = (
      await client.query<{ bytes: string; version: string }>(`
      SELECT pg_database_size(current_database())::text AS bytes, current_setting('server_version') AS version
    `)
    ).rows[0]
    if (!info) throw new Error("DB情報を取得できませんでした")
    const snapshot: Snapshot = {
      version: 1,
      capturedAt: new Date().toISOString(),
      databaseBytes: info.bytes,
      serverVersion: info.version,
      enums: (
        await client.query(`
        SELECT t.typname AS name, array_agg(e.enumlabel::text ORDER BY e.enumsortorder) AS values
        FROM pg_type t JOIN pg_enum e ON e.enumtypid=t.oid
        JOIN pg_namespace n ON n.oid=t.typnamespace WHERE n.nspname='public' GROUP BY t.typname
      `)
      ).rows,
      tables: [],
    }
    for (const table of tables) {
      const columns = (
        await client.query(
          `
        SELECT column_name AS name, udt_name AS type, is_nullable = 'YES' AS nullable, column_default AS default
        FROM information_schema.columns WHERE table_schema='public' AND table_name=$1 ORDER BY ordinal_position
      `,
          [table.name],
        )
      ).rows
      const constraints = (
        await client.query(
          `
        SELECT c.conname AS name, c.contype::text AS kind,
          ARRAY(SELECT a.attname::text FROM unnest(c.conkey) WITH ORDINALITY k(num, ord)
            JOIN pg_attribute a ON a.attrelid=c.conrelid AND a.attnum=k.num ORDER BY k.ord) AS columns,
          r.relname AS target,
          ARRAY(SELECT a.attname::text FROM unnest(c.confkey) WITH ORDINALITY k(num, ord)
            JOIN pg_attribute a ON a.attrelid=c.confrelid AND a.attnum=k.num ORDER BY k.ord) AS "targetColumns",
          c.confupdtype::text AS "onUpdate", c.confdeltype::text AS "onDelete"
        FROM pg_constraint c LEFT JOIN pg_class r ON r.oid=c.confrelid
        WHERE c.conrelid=$1::regclass ORDER BY c.conname
      `,
          [`public.${quoteIdentifier(table.name)}`],
        )
      ).rows
      const indexes = (
        await client.query(
          `
        SELECT ci.relname AS name, i.indisunique AS unique,
          ARRAY(SELECT a.attname::text FROM unnest(i.indkey) WITH ORDINALITY k(num, ord)
            LEFT JOIN pg_attribute a ON a.attrelid=i.indrelid AND a.attnum=k.num ORDER BY k.ord) AS columns,
          am.amname AS method, pg_get_expr(i.indpred, i.indrelid) AS predicate,
          i.indoption::smallint[] AS options, i.indnatts<>i.indnkeyatts AS includes
        FROM pg_index i JOIN pg_class ci ON ci.oid=i.indexrelid JOIN pg_am am ON am.oid=ci.relam
        WHERE i.indrelid=$1::regclass AND NOT i.indisprimary ORDER BY ci.relname
      `,
          [`public.${quoteIdentifier(table.name)}`],
        )
      ).rows
      await client.query(
        `DECLARE migration_rows NO SCROLL CURSOR FOR SELECT * FROM public.${quoteIdentifier(table.name)}`,
      )
      const rows: unknown[][] = []
      while (true) {
        const page = await client.query({
          text: "FETCH 1000 FROM migration_rows",
          rowMode: "array",
        })
        rows.push(...page.rows)
        if (!page.rows.length) break
      }
      await client.query("CLOSE migration_rows")
      snapshot.tables.push({ name: table.name, columns, constraints, indexes, rows })
    }
    await client.query("COMMIT")
    const parsed = snapshotSchema.safeParse(snapshot)
    if (!parsed.success)
      throw new Error(
        `未対応のDB定義: ${parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")}`,
      )
    const output = resolve(directory, "postgres.json")
    await writeFile(output, JSON.stringify(parsed.data), { mode: 0o600, flag: "wx" })
    await chmod(output, 0o600)
    console.log(
      JSON.stringify({
        output,
        tables: snapshot.tables.map((table) => ({ name: table.name, rows: table.rows.length })),
      }),
    )
  } finally {
    await client.end()
  }
}

if (import.meta.main) {
  try {
    const destination = process.argv[2]
    if (!destination)
      throw new Error("使い方: bun scripts/migration/postgres-snapshot.ts <新しい保存ディレクトリ>")
    await exportPostgres(await createBackupDirectory(destination))
  } catch (error) {
    console.error(error instanceof Error ? error.message : "バックアップに失敗しました")
    process.exitCode = 1
  }
}
