import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreatePostInput } from "@/api/create-post-input-schema"
import { fetchApi } from "@/api/fetch-api"
import { postNodeSchema } from "@/api/post-node-schema"

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
