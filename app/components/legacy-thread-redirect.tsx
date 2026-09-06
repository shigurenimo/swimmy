import { permanentRedirect } from "next/navigation"
import { idSchema } from "@/interface/api/id-schema"

type Props = {
  searchParams: Promise<{ threadId?: string | string[] }>
}

export async function LegacyThreadRedirect(props: Props) {
  const searchParams = await props.searchParams
  const legacyThreadId = idSchema.safeParse(searchParams?.threadId)
  if (legacyThreadId.success) {
    permanentRedirect(`/threads/${encodeURIComponent(legacyThreadId.data)}`)
  }

  return null
}
