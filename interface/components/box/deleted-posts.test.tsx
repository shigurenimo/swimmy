import { afterEach, expect, mock, test } from "bun:test"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, render, waitFor } from "@testing-library/react"
import type { PostNode } from "@/interface/api/post-node-schema"
import { BoxAsideFeedThread } from "@/interface/components/box/box-aside-feed-thread"
import { BoxMainFeed } from "@/interface/components/box/box-main-feed"
import { BoxMainFeedThread } from "@/interface/components/box/box-main-feed-thread"
import { mockFetch } from "@/test/mock-fetch"

afterEach(() => {
  cleanup()
  mock.restore()
})

test("deleted posts hide cached content and controls in both lists and thread detail", async () => {
  const post: PostNode = {
    id: "deleted-parent",
    text: "hidden original text",
    createdAt: 0,
    fileIds: ["hidden-image"],
    likesCount: 0,
    repliesCount: 1,
    isDeleted: true,
    reactions: [
      {
        id: "hidden-reaction",
        text: "hidden reaction text",
        count: 0,
        secretCount: 1,
        isConnected: false,
      },
    ],
  }
  const reply = { ...post, id: "deleted-reply", text: "hidden reply text" }
  mockFetch(async (input) => {
    const path = String(input)
    if (path === `/api/threads/${post.id}`) return Response.json(post)
    return Response.json({
      nodes: [path.endsWith("/responses") ? reply : post],
      totalCount: 1,
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
  await waitFor(() => expect(view.getAllByText("この投稿は削除されました。")).toHaveLength(4))
  expect(view.container.textContent).not.toContain("hidden")
  expect(view.queryAllByRole("img")).toHaveLength(0)
  expect(view.queryAllByRole("button", { name: "リアクションを追加" })).toHaveLength(0)
  expect(view.queryByPlaceholderText("返信を書き込む")).toBeNull()
  client.clear()
})
