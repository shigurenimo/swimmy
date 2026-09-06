"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreatePostInput } from "@/interface/api/create-post-input-schema"
import { fetchApi } from "@/interface/api/fetch-api"
import { postNodeSchema } from "@/interface/api/post-node-schema"

export function useCreatePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn(input: CreatePostInput) {
      return fetchApi({
        schema: postNodeSchema,
        path: "/api/posts",
        method: "POST",
        body: input,
      })
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}
