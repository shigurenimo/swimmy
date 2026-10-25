import { and, eq, isNull, or } from "drizzle-orm"
import { defineHandler } from "void"
import { siteUrl } from "@/metadata"
import { getDb } from "@/db"
import { posts } from "@/db/schema"

export const GET = defineHandler(async (c) => {
  const db = await getDb()
  const threads = await db
    .select({ id: posts.id, updatedAt: posts.updatedAt })
    .from(posts)
    .where(and(isNull(posts.replyId), or(eq(posts.isDeleted, false), isNull(posts.isDeleted))))

  const entries: { url: string; lastModified?: Date }[] = [
    ...["/", "/threads", "/terms", "/privacy"].map((path) => ({ url: `${siteUrl}${path}` })),
    ...threads.map((thread) => ({
      url: `${siteUrl}/threads/${thread.id}`,
      lastModified: thread.updatedAt,
    })),
  ]
  const escape = (value: string) => value.replace(/[<>&'"]/g, (char) => `&#${char.charCodeAt(0)};`)
  const xml = entries
    .map(
      (entry) =>
        `<url><loc>${escape(entry.url)}</loc>${entry.lastModified ? `<lastmod>${entry.lastModified.toISOString()}</lastmod>` : ""}</url>`,
    )
    .join("")
  return c.body(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xml}</urlset>`,
    200,
    { "Content-Type": "application/xml; charset=utf-8" },
  )
})
