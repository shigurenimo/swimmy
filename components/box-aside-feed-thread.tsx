import type { FC } from "react"
import { Separator } from "@/components/ui/separator"
import { BoxAside } from "@/components/box-aside"
import { BoxAsideFeedThreadFallback } from "@/components/box-aside-feed-thread-fallback"
import { BoxQueryError } from "@/components/box-query-error"
import { BoxCardPost } from "@/components/box-card-post"
import { BoxCardResponse } from "@/components/box-card-response"
import { BoxFormResponse } from "@/components/box-form-response"
import { ButtonFetchMore } from "@/components/button-fetch-more"
import { useCreateResponseMutation } from "@/hooks/use-create-response-mutation"
import { useThreadQuery } from "@/hooks/use-thread-query"
import { useThreadResponsesQuery } from "@/hooks/use-thread-responses-query"
import type { FormNewPost } from "@/components/form-new-post"

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
          <ul className="flex flex-col gap-4">
            <li>
              <BoxCardPost
                id={threadQuery.data.id}
                text={threadQuery.data.text}
                createdAt={threadQuery.data.createdAt}
                fileIds={threadQuery.data.fileIds}
                repliesCount={threadQuery.data.repliesCount}
                reactions={threadQuery.data.reactions}
                isDeleted={threadQuery.data.isDeleted}
              />
            </li>
            {responses.map((response, index) => (
              <li key={response.id} className="flex flex-col gap-4">
                <BoxCardResponse
                  createdAt={response.createdAt}
                  text={response.text}
                  isDeleted={response.isDeleted}
                  fileIds={response.fileIds}
                  index={index + 1}
                />
                {index !== responses.length - 1 && <Separator />}
              </li>
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
            <div>
              <ButtonFetchMore
                isFetching={responsesQuery.isFetching}
                isFetchingNextPage={responsesQuery.isFetchingNextPage}
                hasNextPage={responsesQuery.hasNextPage}
                onClick={() => responsesQuery.fetchNextPage()}
              />
            </div>
          )}
          {!threadQuery.data.isDeleted && (
            <BoxFormResponse
              isLoading={createResponseMutation.isPending}
              onCreateResponse={onCreateResponse}
            />
          )}
        </>
      )}
    </BoxAside>
  )
}
