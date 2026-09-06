import { and, asc, count, desc, eq, gt, inArray, isNull, type SQL, sql } from "drizzle-orm"
import { nanoid } from "nanoid"
import db from "@/db"
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
        select count(*)::int from likes where likes.post_id = posts.id
      )`,
      repliesCount: sql<number>`(
        select count(*)::int
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
        select count(*)::int
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
  const rows = await db.select({ count: count() }).from(posts).where(eq(posts.replyId, threadId))
  return rows[0]?.count ?? 0
}

export async function createPost(input: CreatePostInput) {
  const id = nanoid()
  const now = new Date()
  const dateText = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("-")

  return db.transaction(async (transaction) => {
    if (input.threadId) {
      const parents = await transaction
        .update(posts)
        .set({ repliesCount: sql`${posts.repliesCount} + 1` })
        .where(eq(posts.id, input.threadId))
        .returning({ id: posts.id })

      if (parents.length === 0) return null
    }

    await transaction.insert(posts).values({
      id,
      text: input.text,
      replyId: input.threadId,
      userId: null,
      fileIds: input.fileIds,
      dateText,
    })

    return id
  })
}

export async function addReaction(postId: string, text: string) {
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
        count: sql`least(${reactions.count} + 1, 11)`,
        updatedAt: new Date(),
      },
    })
}
