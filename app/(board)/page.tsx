import { LegacyThreadRedirect } from "@/app/components/legacy-thread-redirect"

export default function HomePage(props: {
  searchParams: Promise<{ threadId?: string | string[] }>
}) {
  return <LegacyThreadRedirect searchParams={props.searchParams} />
}
