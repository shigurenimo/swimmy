import type { Metadata } from "next"

export const siteName = "スイミー電子掲示板"
export const siteUrl = "https://swimmy.io"
export const siteDescription =
  "日々の出来事や気になる話題を気軽に書き込める電子掲示板です。ホームで新しい投稿を読み、スレッドで返信やリアクションを交わして会話を楽しめます。"

export function pageMetadata(props: {
  title?: string
  description: string
  path: string
}): Metadata {
  const title = props.title ? `${props.title} | ${siteName}` : siteName
  const url = `${siteUrl}${props.path}`
  const image = { url: `${siteUrl}/icons/icon-512.png`, width: 512, height: 512, alt: siteName }

  return {
    title,
    description: props.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ja_JP",
      siteName,
      title,
      description: props.description,
      url,
      images: [image],
    },
    twitter: { card: "summary", title, description: props.description, images: [image] },
  }
}

export function threadMetadata(props: { id: string; text: string | null; isDeleted: boolean }) {
  if (props.isDeleted) {
    return {
      ...pageMetadata({
        title: "削除された投稿",
        description: "この投稿は削除されました。",
        path: `/threads/${props.id}`,
      }),
      robots: { index: false, follow: true },
    }
  }

  const text = Array.from(props.text?.replace(/\s+/g, " ").trim() || "画像の投稿")
  const excerpt = (length: number) =>
    text.slice(0, length).join("") + (text.length > length ? "…" : "")

  return pageMetadata({
    title: excerpt(48),
    description: `${excerpt(120)} — ${siteName}の投稿と返信。`,
    path: `/threads/${props.id}`,
  })
}
