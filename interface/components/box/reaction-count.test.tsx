import { afterEach, expect, mock, test } from "bun:test"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, fireEvent, render } from "@testing-library/react"
import type { PostNode } from "@/interface/api/post-node-schema"
import { BoxMainFeed } from "@/interface/components/box/box-main-feed"
import { mockFetch } from "@/test/mock-fetch"

afterEach(() => {
  cleanup()
  mock.restore()
})

test.each([0, 2])(
  "anonymous reactions increment the displayed count alongside %i user reactions",
  async (count) => {
    const reaction = { id: "reaction-first", text: "👍", count, secretCount: 1, isConnected: false }
    const post: PostNode = {
      id: "post-parent",
      createdAt: 0,
      text: "リアクションできる投稿",
      fileIds: [],
      likesCount: 0,
      repliesCount: 0,
      reactions: [reaction],
      isDeleted: false,
    }
    const fetchMock = mockFetch(async (_, init) => {
      if (init?.method === "POST") {
        reaction.secretCount += 1
        return Response.json(post, { status: 201 })
      }
      return Response.json({
        nodes: [post],
        totalCount: 1,
        pageInfo: { hasNextPage: false, endCursor: null },
      })
    })
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const view = render(
      <QueryClientProvider client={client}>
        <BoxMainFeed threadId={null} />
      </QueryClientProvider>,
    )
    const button = await view.findByRole("button", { name: `👍 ${count + 1}` })
    fireEvent.click(button)

    expect(await view.findByRole("button", { name: `👍 ${count + 2}` })).toBeTruthy()
    expect(
      fetchMock.mock.calls.some(
        ([path, init]) => path === `/api/posts/${post.id}/reactions` && init?.method === "POST",
      ),
    ).toBe(true)
    client.clear()
  },
)
