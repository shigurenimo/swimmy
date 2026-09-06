import { afterEach, expect, mock, test } from "bun:test"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, fireEvent, render } from "@testing-library/react"
import type { PostNode } from "@/interface/api/post-node-schema"
import { BoxAsideFeedThread } from "@/interface/components/box/box-aside-feed-thread"
import { mockFetch } from "@/test/mock-fetch"

afterEach(() => {
  cleanup()
  mock.restore()
})

test("loads subsequent replies and retries a failed page without losing earlier replies", async () => {
  const post: PostNode = {
    id: "post-parent",
    createdAt: 0,
    text: "親の投稿",
    fileIds: [],
    likesCount: 0,
    repliesCount: 2,
    reactions: [],
    isDeleted: false,
  }
  let failNextPage = true
  const fetchMock = mockFetch(async (input) => {
    const url = new URL(String(input), "http://localhost")
    if (url.pathname === `/api/threads/${post.id}`) return Response.json(post)
    const nextPage = url.searchParams.has("after")
    if (nextPage && failNextPage) return Response.json({}, { status: 500 })
    return Response.json({
      totalCount: 2,
      nodes: [
        {
          ...post,
          id: nextPage ? "response-second" : "response-first",
          text: nextPage ? "続きの返信" : "最初の返信",
        },
      ],
      pageInfo: { hasNextPage: !nextPage, endCursor: nextPage ? null : "response-first" },
    })
  })
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const view = render(
    <QueryClientProvider client={client}>
      <BoxAsideFeedThread threadId={post.id} onClose={() => {}} />
    </QueryClientProvider>,
  )
  await view.findByText("最初の返信")
  fireEvent.click(view.getByRole("button", { name: "もっと見る" }))
  await view.findByRole("alert")
  expect(view.getByText("最初の返信")).toBeTruthy()
  failNextPage = false
  fireEvent.click(view.getByRole("button", { name: "再試行" }))

  await view.findByText("続きの返信")
  expect(view.getByText("最初の返信")).toBeTruthy()
  expect(view.queryByRole("button", { name: "もっと見る" })).toBeNull()
  expect(
    fetchMock.mock.calls.filter(([input]) => String(input).endsWith("?after=response-first")),
  ).toHaveLength(2)
  client.clear()
})
