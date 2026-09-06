import { drizzle } from "drizzle-orm/d1"
import * as schema from "@/db/schema"

export async function getDb() {
  const { env } = await import("cloudflare:workers")
  return drizzle(env.DB, { schema })
}
