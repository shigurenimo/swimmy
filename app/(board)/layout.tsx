import { Suspense, type ReactNode } from "react"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { Board } from "@/app/components/board"
import { LayoutHomeApp } from "@/app/components/layout-home-app"
import { HydrateBoard } from "@/app/providers"
import { BoxFeedFallback } from "@/interface/components/box/box-feed-fallback"
import { toPostsPage } from "@/interface/api/to-posts-page"
import { countPosts, countResponses, listPosts, listResponses, readPost } from "@/service/posts"

export const dynamic = "force-dynamic"

export default async function BoardLayout(props: {
  children: ReactNode
  params: Promise<{ threadId?: string }>
}) {
  const { threadId } = await props.params
  const client = new QueryClient()
  await Promise.all([
    ...(["posts", "threads"] as const).map((resource) =>
      client.fetchInfiniteQuery({
        queryKey: [resource],
        initialPageParam: null,
        queryFn: async () => {
          const threadsOnly = resource === "threads"
          const [nodes, totalCount] = await Promise.all([
            listPosts({ cursor: null, limit: 41, threadsOnly }),
            countPosts(threadsOnly),
          ])
          return toPostsPage({ nodes, totalCount, take: 40 })
        },
      }),
    ),
    ...(threadId
      ? [
          client.fetchQuery({ queryKey: ["threads", threadId], queryFn: () => readPost(threadId) }),
          client.fetchInfiniteQuery({
            queryKey: ["threads", threadId, "responses"],
            initialPageParam: null,
            queryFn: async () => {
              const [nodes, totalCount] = await Promise.all([
                listResponses({ threadId, cursor: null, limit: 41 }),
                countResponses(threadId),
              ])
              return toPostsPage({ nodes, totalCount, take: 40 })
            },
          }),
        ]
      : []),
  ])

  return (
    <LayoutHomeApp>
      <HydrateBoard state={dehydrate(client)}>
        {props.children}
        <Suspense fallback={<BoxFeedFallback />}>
          <Board />
        </Suspense>
      </HydrateBoard>
    </LayoutHomeApp>
  )
}
