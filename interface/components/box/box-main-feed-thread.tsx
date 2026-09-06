"use client"

import type { FC } from "react"
import { BoxCardPost } from "@/interface/components/box/box-card-post"
import { BoxMain } from "@/interface/components/box/box-main"
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
    <BoxMain>
      <div className="flex flex-col gap-4 py-4">
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
          <ButtonFetchMore
            isFetching={threadsQuery.isFetching}
            hasNextPage={threadsQuery.hasNextPage}
            isFetchingNextPage={threadsQuery.isFetchingNextPage}
            onClick={onFetchNextPage}
          />
        </div>
      </div>
    </BoxMain>
  )
}
