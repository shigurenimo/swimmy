import {
  PostsDocument,
  PostsQuery,
  useCreatePostMutation,
} from "interface/__generated__/react"

export const useCreateFeedPostMutation = () => {
  return useCreatePostMutation({
    update(cache, result) {
      const query = cache.readQuery<PostsQuery>({
        query: PostsDocument,
      })
      if (query === null) return
      if (typeof result.data === "undefined" || result.data === null) return
      const data: PostsQuery = {
        ...query,
        posts: {
          ...query.posts,
          edges: [
            {
              __typename: "PostEdge",
              cursor: result.data.createPost.id,
              node: result.data.createPost,
            },
            ...query.posts.edges,
          ],
        },
      }
      cache.writeQuery<PostsQuery>({
        query: PostsDocument,
        data: data,
      })
    },
  })
}
