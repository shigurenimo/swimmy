"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchApi } from "@/interface/api/fetch-api"
import { postsPageSchema } from "@/interface/api/posts-page-schema"

export function useThreadResponsesQuery(threadId: string) {
  return useQuery({
    queryKey: ["threads", threadId, "responses"],
    queryFn() {
      return fetchApi({
        schema: postsPageSchema,
        path: `/api/threads/${threadId}/responses`,
        method: "GET",
        body: null,
      })
    },
  })
}
