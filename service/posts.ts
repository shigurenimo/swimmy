import { and, asc, count, desc, eq, gt, inArray, isNull, type SQL, sql } from "drizzle-orm"
import { nanoid } from "nanoid"
import { getDb } from "@/db"
import { posts, reactions } from "@/db/schema"
import type { CreatePostInput } from "@/interface/api/create-post-input-schema"
import { toPostNodes } from "@/service/to-post-nodes"

const rootPostFilter = isNull(posts.replyId)
const threadFilter = and(rootPostFilter, gt(posts.repliesCount, 0))

async function readPosts(props: {
  filter: SQL | undefined
  order: "asc" | "desc"
  cursor: string | null
  limit: number
}) {
  const db = await getDb()
  const filters = props.filter ? [props.filter] : []

  if (props.cursor) {
    const comparison = props.order === "desc" ? sql`<` : sql`>`
    filters.push(
      sql`(posts.created_at, posts.id) ${comparison} (
        select cursor_post.created_at, cursor_post.id
        from posts as cursor_post
        where cursor_post.id = ${props.cursor}
      )`,
    )
  }

  const postRows = await db
    .select({
      id: posts.id,
      createdAt: posts.createdAt,
      text: posts.text,
      fileIds: posts.fileIds,
      isDeleted: posts.isDeleted,
      likesCount: sql<number>`(
        select count(*) from likes where likes.post_id = posts.id
      )`,
      repliesCount: sql<number>`(
        select count(*)
        from posts as replies
        where replies.reply_id = posts.id
      )`,
    })
    .from(posts)
    .where(filters.length > 0 ? sql.join(filters, sql` and `) : undefined)
    .orderBy(
      ...(props.order === "desc"
        ? [desc(posts.createdAt), desc(posts.id)]
        : [asc(posts.createdAt), asc(posts.id)]),
    )
    .limit(props.limit)

  if (postRows.length === 0) {
    return []
  }

  const reactionRows = await db
    .select({
      id: reactions.id,
      postId: reactions.postId,
      text: reactions.text,
      createdAt: reactions.createdAt,
      secretCount: reactions.count,
      usersCount: sql<number>`(
        select count(*)
        from "_user_reactions" as user_reactions
        where user_reactions."A" = reactions.id
      )`,
    })
    .from(reactions)
    .where(
      inArray(
        reactions.postId,
        postRows.map((post) => post.id),
      ),
    )

  return toPostNodes({ posts: postRows, reactions: reactionRows })
}

export async function listPosts(props: {
  cursor: string | null
  limit: number
  threadsOnly?: boolean
}) {
  return readPosts({
    filter: props.threadsOnly ? threadFilter : rootPostFilter,
    order: "desc",
    cursor: props.cursor,
    limit: props.limit,
  })
}

export async function countPosts(threadsOnly = false) {
  const db = await getDb()
  const rows = await db
    .select({ count: count() })
    .from(posts)
    .where(threadsOnly ? threadFilter : rootPostFilter)

  return rows[0]?.count ?? 0
}

export async function readPost(postId: string) {
  const rows = await readPosts({
    filter: eq(posts.id, postId),
    order: "desc",
    cursor: null,
    limit: 1,
  })

  return rows[0] ?? null
}

export async function listResponses(props: {
  threadId: string
  cursor: string | null
  limit: number
}) {
  return readPosts({
    filter: eq(posts.replyId, props.threadId),
    order: "asc",
    cursor: props.cursor,
    limit: props.limit,
  })
}

export async function countResponses(threadId: string) {
  const db = await getDb()
  const rows = await db.select({ count: count() }).from(posts).where(eq(posts.replyId, threadId))
  return rows[0]?.count ?? 0
}

export async function createPost(input: CreatePostInput) {
  const db = await getDb()
  const id = nanoid()
  const now = new Date()
  const dateText = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("-")

  // 親の存在確認と返信数の更新を同じD1バッチ内で行い、途中失敗時は両方を戻す。
  const results = await db.$client.batch<{ id: string }>([
    db.$client
      .prepare(`
      INSERT INTO posts (id, text, reply_id, user_id, file_ids, date_text)
      SELECT ?, ?, ?, NULL, ?, ?
      WHERE ? IS NULL OR EXISTS (SELECT 1 FROM posts WHERE id = ?)
      RETURNING id
    `)
      .bind(
        id,
        input.text,
        input.threadId,
        JSON.stringify(input.fileIds),
        dateText,
        input.threadId,
        input.threadId,
      ),
    db.$client
      .prepare(`
      UPDATE posts SET replies_count = replies_count + 1, updated_at = ?
      WHERE id = ? AND EXISTS (SELECT 1 FROM posts WHERE id = ?)
    `)
      .bind(now.getTime(), input.threadId, id),
  ])
  return results[0]?.results[0]?.id ?? null
}

export async function addReaction(postId: string, text: string) {
  const db = await getDb()
  await db
    .insert(reactions)
    .values({
      id: nanoid(),
      postId,
      text,
      count: 1,
    })
    .onConflictDoUpdate({
      target: [reactions.postId, reactions.text],
      set: {
        count: sql`min(${reactions.count} + 1, 11)`,
        updatedAt: new Date(),
      },
    })
}
