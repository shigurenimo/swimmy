import { and, eq, isNull, or } from "drizzle-orm"
import type { MetadataRoute } from "next"
import { siteUrl } from "@/app/metadata"
import { getDb } from "@/db"
import { posts } from "@/db/schema"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await getDb()
  const threads = await db
    .select({ id: posts.id, updatedAt: posts.updatedAt })
    .from(posts)
    .where(and(isNull(posts.replyId), or(eq(posts.isDeleted, false), isNull(posts.isDeleted))))

  return [
    ...["/", "/threads", "/terms", "/privacy"].map((path) => ({ url: `${siteUrl}${path}` })),
    ...threads.map((thread) => ({
      url: `${siteUrl}/threads/${thread.id}`,
      lastModified: thread.updatedAt,
    })),
  ]
}
