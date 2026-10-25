import { metadataHead, pageMetadata } from "@/metadata"

export const head = () =>
  metadataHead(
    pageMetadata({
      title: "スレッド一覧",
      description:
        "返信が集まったスレッドを一覧で読めます。気になる話題を開いて、投稿への返信やリアクションで会話に参加できます。",
      path: "/threads",
    }),
  )
