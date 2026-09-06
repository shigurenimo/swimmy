import { afterEach, expect, mock, test } from "bun:test"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react"
import type { PostNode } from "@/interface/api/post-node-schema"
import { BoxAsideFeedThread } from "@/interface/components/box/box-aside-feed-thread"
import { BoxMainFeed } from "@/interface/components/box/box-main-feed"
import { BoxMainFeedThread } from "@/interface/components/box/box-main-feed-thread"
import { mockFetch } from "@/test/mock-fetch"

afterEach(() => {
  cleanup()
  mock.restore()
})

const post = {
  id: "post-parent",
  createdAt: 0,
  text: "読み込んだ投稿",
  fileIds: [],
  likesCount: 0,
  repliesCount: 0,
  reactions: [],
  isDeleted: false,
} satisfies PostNode

test.each(["posts", "threads", "detail", "responses"])(
  "shows a failed %s query and allows retrying",
  async (resource) => {
    const path =
      resource === "detail"
        ? `/api/threads/${post.id}`
        : resource === "responses"
          ? `/api/threads/${post.id}/responses`
          : `/api/${resource}`
    let shouldFail = true
    const fetchMock = mockFetch(async (input) => {
      if (String(input) === path && shouldFail) {
        return Response.json({ message: "unavailable" }, { status: 500 })
      }

      return Response.json(
        String(input) === `/api/threads/${post.id}`
          ? post
          : {
              nodes: [post],
              totalCount: 1,
              pageInfo: { hasNextPage: false, endCursor: null },
            },
      )
    })
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const view = render(
      <QueryClientProvider client={client}>
        {resource === "posts" ? (
          <BoxMainFeed threadId={null} />
        ) : resource === "threads" ? (
          <BoxMainFeedThread threadId={null} />
        ) : (
          <BoxAsideFeedThread threadId={post.id} onClose={() => {}} />
        )}
      </QueryClientProvider>,
    )

    await view.findByRole("alert")
    expect(view.queryByText("これ以上はダメ")).toBeNull()
    shouldFail = false
    fireEvent.click(view.getByRole("button", { name: "再試行" }))

    await waitFor(() => expect(view.queryByRole("alert")).toBeNull())
    expect(view.getAllByText(post.text).length).toBeGreaterThan(0)
    expect(fetchMock.mock.calls.filter(([input]) => String(input) === path)).toHaveLength(2)
    client.clear()
  },
)
