import { metadataHead, pageMetadata } from "@/metadata"

export const head = () =>
  metadataHead(
    pageMetadata({
      title: "プライバシーポリシー",
      description:
        "スイミー電子掲示板のプライバシーポリシーです。個人情報の収集、利用、管理について説明しています。",
      path: "/privacy",
    }),
  )
