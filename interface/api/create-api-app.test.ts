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
