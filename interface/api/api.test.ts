import { describe, expect, test } from "bun:test"
import { createPostInputSchema } from "@/interface/api/create-post-input-schema"
import { createReactionInputSchema } from "@/interface/api/create-reaction-input-schema"
import type { PostNode } from "@/interface/api/post-node-schema"
import { toPostsPage } from "@/interface/api/to-posts-page"

const createNode = (id: string): PostNode => ({
  id,
  createdAt: 0,
  text: null,
  fileIds: [],
  likesCount: 0,
  repliesCount: 0,
  reactions: [],
  isDeleted: false,
})

describe("API validation", () => {
  test("normalizes a valid post", () => {
    const result = createPostInputSchema.parse({
      text: " hello ",
      fileIds: [],
      threadId: null,
    })

    expect(result.text).toBe("hello")
  })

  test("rejects oversized input", () => {
    expect(() =>
      createPostInputSchema.parse({
        text: "a".repeat(281),
        fileIds: [],
        threadId: null,
      }),
    ).toThrow()

    expect(() => createReactionInputSchema.parse({ text: "a".repeat(9) })).toThrow()
  })
})

describe("toPostsPage", () => {
  test("uses one look-ahead row for pagination", () => {
    const page = toPostsPage({
      totalCount: 3,
      take: 2,
      nodes: [createNode("first"), createNode("second"), createNode("third")],
    })

    expect(page.nodes.map((node) => node.id)).toEqual(["first", "second"])
    expect(page.pageInfo).toEqual({
      endCursor: "second",
      hasNextPage: true,
    })
  })

  test("finishes without an extra page", () => {
    const page = toPostsPage({
      totalCount: 1,
      take: 2,
      nodes: [createNode("only")],
    })

    expect(page.pageInfo).toEqual({
      endCursor: null,
      hasNextPage: false,
    })
  })
})
