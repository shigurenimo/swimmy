import { afterEach, expect, mock, test } from "bun:test"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, render } from "@testing-library/react"
import type { PostNode } from "@/interface/api/post-node-schema"
import { BoxAsideFeedThread } from "@/interface/components/box/box-aside-feed-thread"
import { mockFetch } from "@/test/mock-fetch"

afterEach(() => {
  cleanup()
  mock.restore()
})

test.each(["返信の写真", null])("renders existing reply attachments with text %s", async (text) => {
  const parent: PostNode = {
    id: "post-parent",
    text: "parent",
    fileIds: [],
    createdAt: 0,
    likesCount: 0,
    repliesCount: 1,
    reactions: [],
    isDeleted: false,
  }
  const reply = {
    ...parent,
    id: "post-reply",
    text,
    fileIds: ["reply-image-first", "reply-image-second"],
  }
  mockFetch(async (input) =>
    Response.json(
      String(input).endsWith("/responses")
        ? { nodes: [reply], totalCount: 1, pageInfo: { hasNextPage: false, endCursor: null } }
        : parent,
    ),
  )
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const view = render(
    <QueryClientProvider client={client}>
      <BoxAsideFeedThread threadId={parent.id} onClose={() => {}} />
    </QueryClientProvider>,
  )
  const images = await view.findAllByRole("img", { name: "投稿の添付画像" })
  expect(images).toHaveLength(2)
  expect(
    images.map((image) => new URL(image.getAttribute("src") ?? "", window.location.href).pathname),
  ).toEqual(reply.fileIds.map((id) => `/api/images/${id}`))
  if (text) expect(view.getByText(text)).toBeTruthy()
  expect(view.getByPlaceholderText("返信を書き込む")).toBeTruthy()
  client.clear()
})
