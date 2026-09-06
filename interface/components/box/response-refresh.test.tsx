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

test("the first response updates counts and adds its post to the thread list", async () => {
  const post: PostNode = {
    id: "post-parent",
    createdAt: 0,
    text: "返信を待っている投稿",
    fileIds: [],
    likesCount: 0,
    repliesCount: 0,
    reactions: [],
    isDeleted: false,
  }
  const response = { ...post, id: "post-response", text: "最初の返信" }
  mockFetch(async (input, init) => {
    if (init?.method === "POST") {
      post.repliesCount = 1
      return Response.json(response, { status: 201 })
    }

    const path = String(input)
    if (path === `/api/threads/${post.id}`) return Response.json(post)

    const nodes = path.endsWith("/responses")
      ? post.repliesCount
        ? [response]
        : []
      : path === "/api/threads" && !post.repliesCount
        ? []
        : [post]
    return Response.json({
      nodes,
      totalCount: nodes.length,
      pageInfo: { hasNextPage: false, endCursor: null },
    })
  })
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const view = render(
    <QueryClientProvider client={client}>
      <BoxMainFeed threadId={post.id} />
      <BoxMainFeedThread threadId={post.id} />
      <BoxAsideFeedThread threadId={post.id} onClose={() => {}} />
    </QueryClientProvider>,
  )
  const input = await view.findByPlaceholderText("返信を書き込む")
  expect(view.queryByText("リプライ 1")).toBeNull()
  fireEvent.change(input, { target: { value: response.text } })
  fireEvent.click(view.getByRole("button", { name: "返信" }))

  await waitFor(() => expect(view.getAllByText("リプライ 1")).toHaveLength(3))
  expect(
    view
      .getAllByRole("link", { name: /返信を待っている投稿/ })
      .map((link) => link.getAttribute("href")),
  ).toEqual([`/threads/${post.id}`, `/threads/${post.id}`])
  expect(view.getByText("最初の返信")).toBeTruthy()
  client.clear()
})
