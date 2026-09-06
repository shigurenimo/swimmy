import { expect, test } from "bun:test"
import { pageMetadata, siteDescription, siteName, threadMetadata } from "@/app/metadata"

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
