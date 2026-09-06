import { afterEach, expect, mock, spyOn, test } from "bun:test"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react"
import type { PostNode } from "@/interface/api/post-node-schema"
import { BoxAsideFeedThread } from "@/interface/components/box/box-aside-feed-thread"
import { BoxMainFeed } from "@/interface/components/box/box-main-feed"

afterEach(() => {
  cleanup()
  mock.restore()
})

const post: PostNode = {
  id: "post-parent",
  createdAt: 0,
  text: "parent post",
  fileIds: [],
  likesCount: 0,
  repliesCount: 0,
  reactions: [],
  isDeleted: false,
}

test.each(["post", "response"])(
  "keeps a failed %s draft until a successful retry",
  async (kind) => {
    let shouldFail = true
    spyOn(console, "error").mockImplementation(() => {})
    const fetchMock = spyOn(globalThis, "fetch").mockImplementation(
      Object.assign(
        async (input: RequestInfo | URL, init?: RequestInit) => {
          if (init?.method === "POST") {
            return shouldFail
              ? Response.json({ message: "unavailable" }, { status: 500 })
              : Response.json(post, { status: 201 })
          }

          return Response.json(
            String(input) === `/api/threads/${post.id}`
              ? post
              : { nodes: [], totalCount: 0, pageInfo: { hasNextPage: false, endCursor: null } },
          )
        },
        { preconnect: fetch.preconnect },
      ),
    )
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const view = render(
      <QueryClientProvider client={client}>
        {kind === "post" ? (
          <BoxMainFeed threadId={null} />
        ) : (
          <BoxAsideFeedThread threadId={post.id} onClose={() => {}} />
        )}
      </QueryClientProvider>,
    )
    const input = await view.findByPlaceholderText(
      kind === "post" ? "新しい書き込み" : "返信を書き込む",
    )
    const buttonName = kind === "post" ? "送信" : "返信"
    fireEvent.change(input, { target: { value: "失いたくない下書き" } })
    fireEvent.click(view.getByRole("button", { name: buttonName }))

    await view.findByRole("alert")
    expect(view.queryByDisplayValue("失いたくない下書き")).not.toBeNull()
    expect(fetchMock.mock.calls.some(([, init]) => init?.method === "POST")).toBe(true)

    shouldFail = false
    fireEvent.click(view.getByRole("button", { name: buttonName }))

    await waitFor(() => expect(view.queryByDisplayValue("失いたくない下書き")).toBeNull())
    expect(view.queryByRole("alert")).toBeNull()
    client.clear()
  },
)
