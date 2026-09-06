import { LegacyThreadRedirect } from "@/app/components/legacy-thread-redirect"

export default function ThreadListPage(props: {
  searchParams: Promise<{ threadId?: string | string[] }>
}) {
  return <LegacyThreadRedirect searchParams={props.searchParams} />
}
