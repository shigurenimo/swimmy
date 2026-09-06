"use client"

import type { FC } from "react"
import { BoxCardPost } from "@/interface/components/box/box-card-post"
import { BoxQueryError } from "@/interface/components/box/box-query-error"
import { BoxFeedFallback } from "@/interface/components/box/box-feed-fallback"
import { ButtonFetchMore } from "@/interface/components/button/button-fetch-more"
import { usePostsQuery } from "@/interface/hooks/use-posts-query"

type Props = {
  threadId: string | null
}

export const BoxMainFeedThread: FC<Props> = (props) => {
  const threadsQuery = usePostsQuery("threads")

  const onFetchNextPage = async () => {
    await threadsQuery.fetchNextPage()
  }

  const threads = threadsQuery.data?.pages.flatMap((page) => page.nodes) ?? []

  return (
    <div className="flex min-w-0 flex-col gap-4 px-4 pb-4">
      {threads.map((thread) => (
        <div key={thread.id}>
          <BoxCardPost
            id={thread.id}
            text={thread.text}
            createdAt={thread.createdAt}
            fileIds={thread.fileIds}
            repliesCount={thread.repliesCount}
            reactions={thread.reactions}
            isActive={thread.id === props.threadId}
            href={`/threads/${thread.id}`}
          />
        </div>
      ))}
      <div>
        {threadsQuery.isError ? (
          <BoxQueryError
            isRetrying={threadsQuery.isFetching}
            onRetry={() =>
              threadsQuery.isFetchNextPageError
                ? threadsQuery.fetchNextPage()
                : threadsQuery.refetch()
            }
          />
        ) : threadsQuery.isLoading ? (
          <BoxFeedFallback />
        ) : (
          <ButtonFetchMore
            isFetching={threadsQuery.isFetching}
            hasNextPage={threadsQuery.hasNextPage}
            isFetchingNextPage={threadsQuery.isFetchingNextPage}
            onClick={onFetchNextPage}
          />
        )}
      </div>
    </div>
  )
}
