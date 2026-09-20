import { afterEach, expect, mock, spyOn, test } from "bun:test"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react"
import {
  createPostInputSchema,
  type CreatePostInput,
} from "@/interface/api/create-post-input-schema"
import type { PostNode } from "@/interface/api/post-node-schema"
import { BoxMainFeed } from "@/interface/components/box/box-main-feed"
import { mockFetch } from "@/test/mock-fetch"

afterEach(() => {
  cleanup()
  mock.restore()
})
const post: PostNode = {
  id: "post-parent",
  text: "photo",
  fileIds: [],
  createdAt: 0,
  likesCount: 0,
  repliesCount: 0,
  reactions: [],
  isDeleted: false,
}
const emptyPage = { nodes: [], totalCount: 0, pageInfo: { hasNextPage: false, endCursor: null } }
const image = new File([new Uint8Array([137, 80, 78, 71])], "photo.png", { type: "image/png" })

test("waits for attachment upload before posting and clears only the submitted draft", async () => {
  const upload = Promise.withResolvers<Response>()
  const submitted: CreatePostInput[] = []
  mockFetch(async (input, init) => {
    if (String(input) === "/api/images") return upload.promise
    if (init?.method === "POST") {
      const data = createPostInputSchema.parse(JSON.parse(String(init.body)))
      submitted.push(data)
      return Response.json({ ...post, ...data }, { status: 201 })
    }
    return Response.json(emptyPage)
  })
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const view = render(
    <QueryClientProvider client={client}>
      <BoxMainFeed threadId={null} />
    </QueryClientProvider>,
  )
  const input = await view.findByPlaceholderText("新しい書き込み")
  fireEvent.change(input, { target: { value: "photo draft" } })
  const fileInput = view.container.querySelector<HTMLInputElement>('input[type="file"]')
  if (!fileInput) throw new Error("画像入力がありません")
  fireEvent.change(fileInput, { target: { files: [image] } })
  await view.findByRole("button", { name: "アップロード中..." })
  expect(view.getByRole("button", { name: "送信" }).hasAttribute("disabled")).toBe(true)
  fireEvent.click(view.getByRole("button", { name: "送信" }))
  expect(submitted).toEqual([])
  upload.resolve(Response.json({ fileId: "uploaded-image" }, { status: 201 }))
  await view.findByRole("img", { name: "投稿の添付画像" })
  await waitFor(() =>
    expect(view.getByRole("button", { name: "送信" }).hasAttribute("disabled")).toBe(false),
  )
  fireEvent.click(view.getByRole("button", { name: "送信" }))
  await waitFor(() => expect(view.queryByDisplayValue("photo draft") === null).toBe(true))
  expect(submitted).toEqual([{ text: "photo draft", fileIds: ["uploaded-image"], threadId: null }])
  expect(view.queryAllByRole("img")).toHaveLength(0)
  client.clear()
})

test("failed uploads report an error and allow retrying the same file without losing the draft", async () => {
  spyOn(console, "error").mockImplementation(() => {})
  let uploads = 0
  mockFetch(async (input) => {
    if (String(input) !== "/api/images") return Response.json(emptyPage)
    uploads += 1
    return uploads === 1
      ? Response.json({ message: "failed" }, { status: 500 })
      : Response.json({ fileId: "uploaded-image" }, { status: 201 })
  })
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const view = render(
    <QueryClientProvider client={client}>
      <BoxMainFeed threadId={null} />
    </QueryClientProvider>,
  )
  fireEvent.change(await view.findByPlaceholderText("新しい書き込み"), {
    target: { value: "keep draft" },
  })
  const fileInput = view.container.querySelector<HTMLInputElement>('input[type="file"]')
  if (!fileInput) throw new Error("画像入力がありません")
  fireEvent.change(fileInput, { target: { files: [image] } })
  expect((await view.findByRole("alert")).textContent).toContain(
    "画像をアップロードできませんでした",
  )
  expect(view.getByDisplayValue("keep draft")).toBeTruthy()
  expect(fileInput.value).toBe("")
  fireEvent.change(fileInput, { target: { files: [image] } })
  await view.findByRole("img", { name: "投稿の添付画像" })
  expect(uploads).toBe(2)
  expect(view.queryByRole("alert")).toBeNull()
  expect(view.getByDisplayValue("keep draft")).toBeTruthy()
  client.clear()
})
