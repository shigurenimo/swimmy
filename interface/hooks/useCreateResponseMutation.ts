import {
  ResponsesDocument,
  ResponsesQuery,
  useCreatePostMutation,
} from "interface/__generated__/react"

type Props = {
  threadId: string
}

export const useCreateResponseMutation = (props: Props) => {
  return useCreatePostMutation({
    update(cache, result) {
      const query = cache.readQuery<ResponsesQuery>({
        query: ResponsesDocument,
        variables: { threadId: props.threadId },
      })
      if (query === null) return
      if (typeof result.data === "undefined" || result.data === null) return
      const data: ResponsesQuery = {
        ...query,
        responses: {
          ...query.responses,
          edges: [
            ...query.responses.edges,
            {
              __typename: "PostEdge",
              cursor: result.data.createPost.id,
              node: result.data.createPost,
            },
          ],
        },
      }
      cache.writeQuery<ResponsesQuery>({
        query: ResponsesDocument,
        variables: { threadId: props.threadId },
        data: data,
      })
    },
  })
}
