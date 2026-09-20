import { afterEach, expect, mock, spyOn, test } from "bun:test"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react"
import type { PostNode } from "@/interface/api/post-node-schema"
import { BoxCardPost } from "@/interface/components/box/box-card-post"
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
  isDeleted: false,
  reactions: [
    { id: "reaction-first", text: "first", count: 0, secretCount: 1, isConnected: false },
  ],
}

for (const kind of ["new", "existing"] as const) {
  test.each(["http", "network"])(
    `${kind} reactions report %s errors and allow a successful retry`,
    async (failure) => {
      spyOn(console, "error").mockImplementation(() => {})
      let attempts = 0
      const retry = Promise.withResolvers<Response>()
      const fetchMock = mockFetch(async () => {
        attempts += 1
        if (attempts > 1) return retry.promise
        if (failure === "network") throw new TypeError("Network failure")
        return Response.json({ message: "unavailable" }, { status: 500 })
      })
      const close = mock(() => {})
      const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
      const view = render(
        <QueryClientProvider client={client}>
          {kind === "new" ? (
            <BoxFormReaction postId={post.id} onClose={close} />
          ) : (
            <BoxCardPost {...post} />
          )}
        </QueryClientProvider>,
      )
      if (kind === "new")
        fireEvent.change(view.getByPlaceholderText("リアクション (絵文字など)"), {
          target: { value: "first" },
        })
      const buttonName = kind === "new" ? "送信" : "first 1"
      fireEvent.click(view.getByRole("button", { name: buttonName }))
      expect((await view.findByRole("alert")).textContent).toContain(
        "リアクションを送信できませんでした",
      )
      expect(close).not.toHaveBeenCalled()
      if (kind === "new") {
        expect(view.getByDisplayValue("first").hasAttribute("disabled")).toBe(false)
        expect(view.getByRole("button", { name: "キャンセル" }).hasAttribute("disabled")).toBe(
          false,
        )
      }
      fireEvent.click(view.getByRole("button", { name: buttonName }))
      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
      await waitFor(() => expect(view.queryByRole("alert") === null).toBe(true))
      retry.resolve(Response.json(post, { status: 201 }))
      if (kind === "new") await waitFor(() => expect(close).toHaveBeenCalledTimes(1))
      await waitFor(() => expect(client.isMutating()).toBe(0))
      expect(view.queryByRole("alert")).toBeNull()
      expect(fetchMock.mock.calls.map(([, init]) => init?.body)).toEqual([
        JSON.stringify({ text: "first" }),
        JSON.stringify({ text: "first" }),
      ])
      client.clear()
    },
  )
}
