import { afterAll, afterEach, beforeAll, beforeEach, expect, mock, spyOn, test } from "bun:test"
import { drizzle } from "drizzle-orm/d1"
import { Miniflare } from "miniflare"
import { z } from "zod"
import * as connection from "@/db"
import * as schema from "@/db/schema"
import { createApiApp } from "@/interface/api/create-api-app"
import { addReaction, createPost, listPosts, readPost } from "@/service/posts"

const runtime = new Miniflare({
  workers: [
    {
      config: {
        name: "test",
        type: "worker",
        compatibilityDate: "2026-09-06",
        manifest: {
          mainModule: "index.js",
          modules: {
            "index.js": {
              type: "esm",
              contents: "export default { fetch() { return new Response('test') } }",
            },
          },
        },
        env: { DB: { type: "d1", id: "test" } },
      },
    },
  ],
})
const database = await runtime.getD1Database("DB")

beforeAll(async () => {
  const sql = await Bun.file("db/migrations/0001_initial.sql").text()
  for (const statement of sql.split(";").filter((statement) => statement.trim())) {
    await database.prepare(statement).run()
  }
})

beforeEach(async () => {
  await database.exec("DELETE FROM reactions; DELETE FROM posts;")
  spyOn(connection, "getDb").mockResolvedValue(drizzle(database, { schema }))
})
afterEach(() => mock.restore())
afterAll(() => runtime.dispose())

test("D1 creates replies atomically and rejects a missing parent", async () => {
  const parent = await createPost({ text: "parent", fileIds: [], threadId: null })
  if (!parent) throw new Error("親投稿を作成できませんでした")
  const missing = await createPost({ text: "missing", fileIds: [], threadId: "missing-parent" })
  expect(missing).toBeNull()
  await Promise.all(
    Array.from({ length: 4 }, () => createPost({ text: "reply", fileIds: [], threadId: parent })),
  )
  expect((await readPost(parent))?.repliesCount).toBe(4)
  expect(
    await database
      .prepare("SELECT replies_count FROM posts WHERE id = ?")
      .bind(parent)
      .first<number>("replies_count"),
  ).toBe(4)
  expect(await database.prepare("SELECT count(*) AS count FROM posts").first<number>("count")).toBe(
    5,
  )
})

test("D1 keeps anonymous reactions capped at 11", async () => {
  const postId = await createPost({ text: "react", fileIds: [], threadId: null })
  if (!postId) throw new Error("投稿を作成できませんでした")
  for (let index = 0; index < 16; index++) await addReaction(postId, "🙂")
  const post = await readPost(postId)
  expect(post?.reactions).toHaveLength(1)
  expect(post?.reactions[0]?.secretCount).toBe(11)
  expect(post?.reactions[0]?.count).toBe(0)
})

test.each(["missing", "deleted"])(
  "reactions on a %s post return 404 without creating an orphan",
  async (state) => {
    const postId =
      state === "deleted"
        ? await createPost({ text: "deleted", fileIds: [], threadId: null })
        : "missing-post"
    if (!postId) throw new Error("投稿を作成できませんでした")
    if (state === "deleted") {
      await database.prepare("DELETE FROM posts WHERE id = ?").bind(postId).run()
    }

    const response = await createApiApp().request(`/api/posts/${postId}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "🙂" }),
    })

    expect(response.status).toBe(404)
    expect(z.object({ message: z.string() }).parse(await response.json())).toEqual({
      message: "投稿が見つかりません",
    })
    expect(
      await database.prepare("SELECT count(*) AS count FROM reactions").first<number>("count"),
    ).toBe(0)
  },
)

test("D1 pagination does not skip posts with equal timestamps", async () => {
  for (const id of ["fixture-a", "fixture-b", "fixture-c", "fixture-d"]) {
    await database
      .prepare(
        "INSERT INTO posts (id, created_at, text, date_text) VALUES (?, 1000, ?, '1970-1-1')",
      )
      .bind(id, id)
      .run()
  }
  const first = await listPosts({ cursor: null, limit: 2 })
  const second = await listPosts({ cursor: first[1]?.id ?? null, limit: 2 })
  expect(first.map((post) => post.id)).toEqual(["fixture-d", "fixture-c"])
  expect(second.map((post) => post.id)).toEqual(["fixture-b", "fixture-a"])
})

test("soft-deleted posts are redacted across APIs and reject writes without changing data", async () => {
  const parent = await createPost({
    text: "hidden parent",
    fileIds: ["hidden-parent-image"],
    threadId: null,
  })
  if (!parent) throw new Error("親投稿を作成できませんでした")
  const reply = await createPost({
    text: "hidden reply",
    fileIds: ["hidden-reply-image"],
    threadId: parent,
  })
  if (!reply) throw new Error("返信を作成できませんでした")
  await addReaction(parent, "hidden reaction")
  await database.prepare("UPDATE posts SET is_deleted=1").run()
  const before = await database.prepare("SELECT * FROM posts ORDER BY id").all()
  const reactionsBefore = await database.prepare("SELECT * FROM reactions ORDER BY id").all()
  const app = createApiApp()
  for (const path of [
    "/api/posts",
    "/api/threads",
    `/api/threads/${parent}`,
    `/api/threads/${parent}/responses`,
  ]) {
    const response = await app.request(path)
    expect(response.status).toBe(200)
    const payload = await response.text()
    expect(payload).not.toContain("hidden")
    const decoded = JSON.parse(payload)
    const nodes = path === `/api/threads/${parent}` ? [decoded] : decoded.nodes
    expect(nodes).toHaveLength(1)
    expect(nodes[0]).toMatchObject({ isDeleted: true, text: null, fileIds: [], reactions: [] })
  }
  for (const id of [parent, reply]) {
    const reaction = await app.request(`/api/posts/${id}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "new" }),
    })
    expect(reaction.status).toBe(404)
    const response = await app.request("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "new reply", fileIds: [], threadId: id }),
    })
    expect(response.status).toBe(404)
  }
  expect((await database.prepare("SELECT * FROM posts ORDER BY id").all()).results).toEqual(
    before.results,
  )
  expect((await database.prepare("SELECT * FROM reactions ORDER BY id").all()).results).toEqual(
    reactionsBefore.results,
  )
})
