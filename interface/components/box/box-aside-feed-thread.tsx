"use client"

import { type FC, Fragment } from "react"
import { Separator } from "@/components/ui/separator"
import { BoxAside } from "@/interface/components/box/box-aside"
import { BoxAsideFeedThreadFallback } from "@/interface/components/box/box-aside-feed-thread-fallback"
import { BoxQueryError } from "@/interface/components/box/box-query-error"
import { BoxCardPost } from "@/interface/components/box/box-card-post"
import { BoxCardResponse } from "@/interface/components/box/box-card-response"
import { BoxFormResponse } from "@/interface/components/box/box-form-response"
import { ButtonFetchMore } from "@/interface/components/button/button-fetch-more"
import { useCreateResponseMutation } from "@/interface/hooks/use-create-response-mutation"
import { useThreadQuery } from "@/interface/hooks/use-thread-query"
import { useThreadResponsesQuery } from "@/interface/hooks/use-thread-responses-query"
import type { FormNewPost } from "@/interface/types/form-new-post"

type Props = {
  threadId: string
  onClose(): void
}

export const BoxAsideFeedThread: FC<Props> = (props) => {
  const threadQuery = useThreadQuery(props.threadId)

  const responsesQuery = useThreadResponsesQuery(props.threadId)

  const createResponseMutation = useCreateResponseMutation({
    threadId: props.threadId,
  })

  const onCreateResponse = async (value: FormNewPost) => {
    await createResponseMutation.mutateAsync({ text: value.text, fileIds: [] })
  }

  if (threadQuery.isLoading) {
    return <BoxAsideFeedThreadFallback />
  }

  const responses = responsesQuery.data?.pages.flatMap((page) => page.nodes) ?? []

  return (
    <BoxAside title="スレッド" onClose={props.onClose}>
      {threadQuery.isError && (
        <BoxQueryError isRetrying={threadQuery.isFetching} onRetry={() => threadQuery.refetch()} />
      )}
      {threadQuery.data && (
        <>
          <ul className="flex flex-col p-4">
            <li className="pt-2 pb-2">
              <BoxCardPost
                id={threadQuery.data.id}
                text={threadQuery.data.text}
                createdAt={threadQuery.data.createdAt}
                fileIds={threadQuery.data.fileIds}
                repliesCount={threadQuery.data.repliesCount}
                reactions={threadQuery.data.reactions}
              />
            </li>
            {responses.map((response, index) => (
              <Fragment key={response.id}>
                <li className="py-2">
                  <BoxCardResponse
                    createdAt={response.createdAt}
                    text={response.text}
                    index={index + 1}
                  />
                </li>
                {index !== responses.length - 1 && (
                  <div className="px-2">
                    <Separator />
                  </div>
                )}
              </Fragment>
            ))}
          </ul>
          {responsesQuery.isError && (
            <BoxQueryError
              isRetrying={responsesQuery.isFetching}
              onRetry={() =>
                responsesQuery.isFetchNextPageError
                  ? responsesQuery.fetchNextPage()
                  : responsesQuery.refetch()
              }
            />
          )}
          {responsesQuery.hasNextPage && !responsesQuery.isError && (
            <div className="p-4">
              <ButtonFetchMore
                isFetching={responsesQuery.isFetching}
                isFetchingNextPage={responsesQuery.isFetchingNextPage}
                hasNextPage={responsesQuery.hasNextPage}
                onClick={() => responsesQuery.fetchNextPage()}
              />
            </div>
          )}
          <BoxFormResponse
            isLoading={createResponseMutation.isPending}
            onCreateResponse={onCreateResponse}
          />
        </>
      )}
    </BoxAside>
  )
}
