import { notFound } from "next/navigation"
import { cache } from "react"
import { threadMetadata } from "@/app/metadata"
import { idSchema } from "@/interface/api/id-schema"
import { readPost } from "@/service/posts"

type Props = { params: Promise<{ threadId: string }> }

const readThread = cache(async (id: string) => {
  const threadId = idSchema.safeParse(id)
  if (!threadId.success) notFound()
  const post = await readPost(threadId.data)
  if (!post) notFound()
  return post
})

export async function generateMetadata(props: Props) {
  const { threadId } = await props.params
  return threadMetadata(await readThread(threadId))
}

export default async function ThreadDetailPage(props: Props) {
  const { threadId } = await props.params
  await readThread(threadId)
  return null
}
