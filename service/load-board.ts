import { dehydrate, QueryClient } from "@tanstack/react-query"
import { toPostsPage } from "@/interface/api/to-posts-page"
import { countPosts, countResponses, listPosts, listResponses, readPost } from "@/service/posts"

export type BoardData = NonNullable<Awaited<ReturnType<typeof loadBoard>>>

export async function loadBoard(threadId: string | null) {
  const post = threadId ? await readPost(threadId) : null
  if (threadId && !post) return null
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
          client.fetchQuery({ queryKey: ["threads", threadId], queryFn: async () => post }),
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

  return { state: dehydrate(client), post }
}
