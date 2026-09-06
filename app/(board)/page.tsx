import { LegacyThreadRedirect } from "@/app/components/legacy-thread-redirect"
import { pageMetadata, siteDescription } from "@/app/metadata"

export const metadata = pageMetadata({ description: siteDescription, path: "/" })

export default function HomePage(props: {
  searchParams: Promise<{ threadId?: string | string[] }>
}) {
  return <LegacyThreadRedirect searchParams={props.searchParams} />
}
