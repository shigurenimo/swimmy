import { expect, test } from "bun:test"
import { metadataHead, pageMetadata, siteDescription, siteName, threadMetadata } from "@/metadata"

test("page metadata uses canonical public URLs and Japanese share information", () => {
  const metadata = pageMetadata({
    title: "スレッド一覧",
    description: siteDescription,
    path: "/threads",
  })
  expect(metadata.title).toBe(`スレッド一覧 | ${siteName}`)
  expect(metadata.alternates?.canonical).toBe("https://swimmy.io/threads")
  expect(metadata.openGraph).toMatchObject({
    title: metadata.title,
    description: siteDescription,
    url: "https://swimmy.io/threads",
    locale: "ja_JP",
  })
  expect(metadata.twitter).toMatchObject({ title: metadata.title, description: siteDescription })
})

test("thread descriptions normalize whitespace and preserve Unicode when truncated", () => {
  const metadata = threadMetadata({
    id: "test-thread",
    text: `  今日の話題\n ${"🐟".repeat(160)} `,
    isDeleted: false,
  })
  expect(metadata.title).toBe(`今日の話題 ${"🐟".repeat(42)}… | ${siteName}`)
  expect(metadata.description).toBe(`今日の話題 ${"🐟".repeat(114)}… — ${siteName}の投稿と返信。`)
  expect(metadata.alternates?.canonical).toBe("https://swimmy.io/threads/test-thread")
})

test("deleted thread metadata excludes its content and disables indexing", () => {
  const metadata = threadMetadata({ id: "test-thread", text: "削除された本文", isDeleted: true })
  expect(metadata.robots).toEqual({ index: false, follow: true })
  expect(JSON.stringify(metadata)).not.toContain("削除された本文")
})

test("Void head preserves canonical, social image attributes and deleted-thread robots", () => {
  const head = metadataHead(
    threadMetadata({ id: "deleted-thread", text: "非公開の本文", isDeleted: true }),
  )
  expect(head.link).toContainEqual({
    rel: "canonical",
    href: "https://swimmy.io/threads/deleted-thread",
  })
  expect(head.meta).toContainEqual({ name: "robots", content: "noindex, follow" })
  expect(head.meta).toContainEqual({
    property: "og:image",
    content: "https://swimmy.io/icons/icon-512.png",
  })
  expect(head.meta).toContainEqual({ property: "og:image:width", content: "512" })
  expect(head.meta).toContainEqual({
    name: "twitter:image",
    content: "https://swimmy.io/icons/icon-512.png",
  })
  expect(JSON.stringify(head)).not.toContain("非公開の本文")
})
