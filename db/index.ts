import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "@/db/schema"

const globalForDrizzle: typeof globalThis & {
  drizzle?: NodePgDatabase<typeof schema>
} = globalThis

const db =
  globalForDrizzle.drizzle ??
  drizzle(new Pool({ connectionString: process.env.DATABASE_URL }), { schema })

if (process.env.NODE_ENV !== "production") {
  globalForDrizzle.drizzle = db
}

export default db
