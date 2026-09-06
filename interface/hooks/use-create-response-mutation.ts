"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchApi } from "@/interface/api/fetch-api"
import { postNodeSchema } from "@/interface/api/post-node-schema"

type Props = {
  threadId: string
}

type Variables = {
  text: string
  fileIds: string[]
}

export function useCreateResponseMutation(props: Props) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn(variables: Variables) {
      return fetchApi({
        schema: postNodeSchema,
        path: "/api/posts",
        method: "POST",
        body: {
          text: variables.text,
          fileIds: variables.fileIds,
          threadId: props.threadId,
        },
      })
    },
    async onSuccess() {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["threads"] }),
      ])
    },
  })
}
