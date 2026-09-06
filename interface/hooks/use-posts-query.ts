"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchApi } from "@/interface/api/fetch-api"
import { postsPageSchema } from "@/interface/api/posts-page-schema"

export function usePostsQuery(resource: "posts" | "threads" = "posts") {
  return useInfiniteQuery({
    queryKey: [resource],
    initialPageParam: null,
    queryFn(context: { pageParam: string | null }) {
      const searchParams = new URLSearchParams()

      if (context.pageParam !== null) {
        searchParams.set("after", context.pageParam)
      }

      const queryString = searchParams.toString()

      return fetchApi({
        schema: postsPageSchema,
        path: queryString ? `/api/${resource}?${queryString}` : `/api/${resource}`,
        method: "GET",
        body: null,
      })
    },
    getNextPageParam(lastPage) {
      return lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.endCursor : null
    },
  })
}
