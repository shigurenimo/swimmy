"use client"

import type { FC } from "react"
import { BoxCardPost } from "@/interface/components/box/box-card-post"
import { BoxFormPost } from "@/interface/components/box/box-form-post"
import { BoxQueryError } from "@/interface/components/box/box-query-error"
import { BoxFeedFallback } from "@/interface/components/box/box-feed-fallback"
import { ButtonFetchMore } from "@/interface/components/button/button-fetch-more"
import { useCreatePostMutation } from "@/interface/hooks/use-create-post-mutation"
import { usePostsQuery } from "@/interface/hooks/use-posts-query"
import type { FormNewPost } from "@/interface/types/form-new-post"

type Props = {
  threadId: string | null
}

export const BoxMainFeed: FC<Props> = (props) => {
  const postsQuery = usePostsQuery()

  const createPostMutation = useCreatePostMutation()

  const onCreatePost = async (value: FormNewPost) => {
    await createPostMutation.mutateAsync({
      text: value.text,
      fileIds: value.fileIds,
      threadId: null,
    })
  }

  const onFetchMore = async () => {
    await postsQuery.fetchNextPage()
  }

  const posts = postsQuery.data?.pages.flatMap((page) => page.nodes) ?? []

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <BoxFormPost isLoading={createPostMutation.isPending} onCreatePost={onCreatePost} />
      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.id}>
            <BoxCardPost
              id={post.id}
              text={post.text}
              createdAt={post.createdAt}
              fileIds={post.fileIds}
              repliesCount={post.repliesCount}
              reactions={post.reactions}
              isActive={post.id === props.threadId}
              href={`/?threadId=${post.id}`}
            />
          </li>
        ))}
        <li>
          {postsQuery.isError ? (
            <BoxQueryError
              isRetrying={postsQuery.isFetching}
              onRetry={() =>
                postsQuery.isFetchNextPageError ? postsQuery.fetchNextPage() : postsQuery.refetch()
              }
            />
          ) : postsQuery.isLoading ? (
            <BoxFeedFallback />
          ) : (
            <ButtonFetchMore
              isFetching={postsQuery.isFetching}
              hasNextPage={postsQuery.hasNextPage}
              isFetchingNextPage={postsQuery.isFetchingNextPage}
              onClick={onFetchMore}
            />
          )}
        </li>
      </ul>
    </div>
  )
}
