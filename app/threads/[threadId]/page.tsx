import { BoardPage } from "@/app/components/board-page"

type Props = {
  params: Promise<{ threadId: string }>
}

export default async function ThreadDetailPage(props: Props) {
  const params = await props.params

  return <BoardPage initialTab="threads" threadId={params.threadId} />
}
