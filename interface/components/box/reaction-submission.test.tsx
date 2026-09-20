import { afterEach, expect, mock, test } from "bun:test"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react"
import type { PostNode } from "@/interface/api/post-node-schema"
import { BoxFormReaction } from "@/interface/components/box/box-form-reaction"
import { mockFetch } from "@/test/mock-fetch"

afterEach(() => {
  cleanup()
  mock.restore()
})
const post: PostNode = {
  id: "post-parent",
  text: "parent",
  fileIds: [],
  createdAt: 0,
  likesCount: 0,
  repliesCount: 0,
  reactions: [],
  isDeleted: false,
}

test("submits a new reaction once and locks editing and cancellation until it settles", async () => {
  const request = Promise.withResolvers<Response>()
  const fetchMock = mockFetch(() => request.promise)
  const close = mock(() => {})
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const view = render(
    <QueryClientProvider client={client}>
      <BoxFormReaction postId={post.id} onClose={close} />
    </QueryClientProvider>,
  )
  const input = view.getByPlaceholderText("リアクション (絵文字など)")
  const form = view.container.querySelector("form")
  if (!form) throw new Error("リアクションフォームがありません")
  fireEvent.change(input, { target: { value: "first" } })
  fireEvent.submit(form)
  fireEvent.submit(form)
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
  await waitFor(() => expect(input.hasAttribute("disabled")).toBe(true))
  expect(view.getByRole("button", { name: "送信中..." }).hasAttribute("disabled")).toBe(true)
  const cancel = view.getByRole("button", { name: "キャンセル" })
  expect(cancel.hasAttribute("disabled")).toBe(true)
  fireEvent.click(cancel)
  expect(close).not.toHaveBeenCalled()
  expect(view.getByDisplayValue("first")).toBeTruthy()
  expect(fetchMock.mock.calls[0]?.[1]?.body).toBe(JSON.stringify({ text: "first" }))
  request.resolve(Response.json(post, { status: 201 }))
  await waitFor(() => expect(close).toHaveBeenCalledTimes(1))
  expect(view.queryByDisplayValue("first") === null).toBe(true)
  client.clear()
})
