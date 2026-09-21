"use client"

import type { FC } from "react"
import { BoxCardPost } from "@/interface/components/box/box-card-post"
import { BoxQueryError } from "@/interface/components/box/box-query-error"
import { BoxFeedFallback } from "@/interface/components/box/box-feed-fallback"
import { ButtonFetchMore } from "@/interface/components/button/button-fetch-more"
import { usePostsQuery } from "@/interface/hooks/use-posts-query"

type Props = {
  threadId: string | null
  resource: "posts" | "threads"
}

export const BoxPostList: FC<Props> = (props) => {
  const postsQuery = usePostsQuery(props.resource)
  const posts = postsQuery.data?.pages.flatMap((page) => page.nodes) ?? []

  return (
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
            isDeleted={post.isDeleted}
            isActive={post.id === props.threadId}
            href={`/threads/${post.id}`}
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
            onClick={() => postsQuery.fetchNextPage()}
          />
        )}
      </li>
    </ul>
  )
}
