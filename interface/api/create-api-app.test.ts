import { afterEach, expect, mock, spyOn, test } from "bun:test"
import { createApiApp } from "@/interface/api/create-api-app"
import type { PostNode } from "@/interface/api/post-node-schema"
import * as postService from "@/service/posts"

afterEach(() => mock.restore())

const post: PostNode = {
  id: "post-first",
  createdAt: 0,
  text: "hello",
  fileIds: [],
  likesCount: 0,
  repliesCount: 0,
  reactions: [],
  isDeleted: false,
}

test("POST /posts returns 404 when the reply target does not exist", async () => {
  spyOn(postService, "createPost").mockResolvedValue(null)
  const readPost = spyOn(postService, "readPost")
  const response = await createApiApp().request("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "reply", threadId: "missing-parent", fileIds: [] }),
  })

  expect(response.status).toBe(404)
  expect(await response.json()).toEqual({ message: "返信先の投稿が見つかりません" })
  expect(readPost).not.toHaveBeenCalled()
})

test.each(["posts", "threads"])("GET /%s preserves pagination and filtering", async (resource) => {
  const listPosts = spyOn(postService, "listPosts").mockResolvedValue(
    Array.from({ length: 41 }, (_, index) => ({ ...post, id: `post-${index}` })),
  )
  const countPosts = spyOn(postService, "countPosts").mockResolvedValue(50)
  const response = await createApiApp().request(`/api/${resource}?after=post-cursor`)
  const page = await response.json()

  expect(response.status).toBe(200)
  expect(page.totalCount).toBe(50)
  expect(page.nodes).toHaveLength(40)
  expect(page.pageInfo).toEqual({ endCursor: "post-39", hasNextPage: true })
  expect(listPosts).toHaveBeenCalledWith({
    cursor: "post-cursor",
    limit: 41,
    threadsOnly: resource === "threads",
  })
  expect(countPosts).toHaveBeenCalledWith(resource === "threads")
})

test.each(["posts", "threads"])(
  "GET /%s accepts the first page and rejects invalid cursors",
  async (resource) => {
    const listPosts = spyOn(postService, "listPosts").mockResolvedValue([])
    spyOn(postService, "countPosts").mockResolvedValue(0)
    const app = createApiApp()
    const firstPage = await app.request(`/api/${resource}`)

    expect(firstPage.status).toBe(200)
    expect(await firstPage.json()).toEqual({
      totalCount: 0,
      nodes: [],
      pageInfo: { endCursor: null, hasNextPage: false },
    })
    expect(listPosts).toHaveBeenCalledWith({
      cursor: null,
      limit: 41,
      threadsOnly: resource === "threads",
    })

    const invalidPage = await app.request(`/api/${resource}?after=short`)

    expect(invalidPage.status).toBe(400)
    expect(listPosts).toHaveBeenCalledTimes(1)
  },
)

test("thread detail and responses keep their distinct routes", async () => {
  spyOn(postService, "readPost").mockResolvedValue(post)
  spyOn(postService, "listResponses").mockResolvedValue([])
  spyOn(postService, "countResponses").mockResolvedValue(0)
  const app = createApiApp()
  const detail = await app.request(`/api/threads/${post.id}`)
  const responses = await app.request(`/api/threads/${post.id}/responses`)

  expect(await detail.json()).toEqual(post)
  expect(await responses.json()).toEqual({
    totalCount: 0,
    nodes: [],
    pageInfo: { endCursor: null, hasNextPage: false },
  })
})

test("responses expose additional pages beyond 1000 replies", async () => {
  const listResponses = spyOn(postService, "listResponses").mockResolvedValue(
    Array.from({ length: 41 }, (_, index) => ({ ...post, id: `response-${index}` })),
  )
  spyOn(postService, "countResponses").mockResolvedValue(1001)
  const app = createApiApp()
  const response = await app.request(`/api/threads/${post.id}/responses?after=response-cursor`)
  const page = await response.json()

  expect(response.status).toBe(200)
  expect(page.totalCount).toBe(1001)
  expect(page.nodes).toHaveLength(40)
  expect(page.pageInfo).toEqual({ hasNextPage: true, endCursor: "response-39" })
  expect(listResponses).toHaveBeenCalledWith({
    threadId: post.id,
    cursor: "response-cursor",
    limit: 41,
  })

  const invalid = await app.request(`/api/threads/${post.id}/responses?after=short`)
  expect(invalid.status).toBe(400)
  expect(listResponses).toHaveBeenCalledTimes(1)
})
