"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchApi } from "@/interface/api/fetch-api"
import { postNodeSchema } from "@/interface/api/post-node-schema"

export function useThreadQuery(threadId: string) {
  return useQuery({
    queryKey: ["threads", threadId],
    queryFn() {
      return fetchApi({
        schema: postNodeSchema,
        path: `/api/threads/${threadId}`,
        method: "GET",
        body: null,
      })
    },
  })
}
