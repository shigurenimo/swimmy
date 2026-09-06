import { afterAll, afterEach, beforeAll, beforeEach, expect, mock, spyOn, test } from "bun:test"
import { drizzle } from "drizzle-orm/d1"
import { Miniflare } from "miniflare"
import * as connection from "@/db"
import * as schema from "@/db/schema"
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
