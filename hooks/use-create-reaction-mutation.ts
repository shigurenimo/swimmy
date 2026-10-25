import { useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchApi } from "@/api/fetch-api"
import { postNodeSchema } from "@/api/post-node-schema"

type Variables = {
  postId: string
  text: string
}

export function useCreateReactionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn(variables: Variables) {
      return fetchApi({
        schema: postNodeSchema,
        path: `/api/posts/${variables.postId}/reactions`,
        method: "POST",
        body: { text: variables.text },
      })
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["posts"] })

      await queryClient.invalidateQueries({ queryKey: ["threads"] })
    },
  })
}
