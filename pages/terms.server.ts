import { metadataHead, pageMetadata } from "@/metadata"

export const head = () =>
  metadataHead(
    pageMetadata({
      title: "利用規約",
      description:
        "スイミー電子掲示板の利用規約です。サービスの利用条件、禁止事項、免責事項をご確認いただけます。",
      path: "/terms",
    }),
  )
