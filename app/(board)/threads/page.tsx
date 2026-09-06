import { LegacyThreadRedirect } from "@/app/components/legacy-thread-redirect"
import { pageMetadata } from "@/app/metadata"

export const metadata = pageMetadata({
  title: "スレッド一覧",
  description:
    "返信が集まったスレッドを一覧で読めます。気になる話題を開いて、投稿への返信やリアクションで会話に参加できます。",
  path: "/threads",
})

export default function ThreadListPage(props: {
  searchParams: Promise<{ threadId?: string | string[] }>
}) {
  return <LegacyThreadRedirect searchParams={props.searchParams} />
}
