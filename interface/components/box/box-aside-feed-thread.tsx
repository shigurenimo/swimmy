"use client"

import { type FC, Fragment } from "react"
import { Separator } from "@/components/ui/separator"
import { BoxAside } from "@/interface/components/box/box-aside"
import { BoxAsideFeedThreadFallback } from "@/interface/components/box/box-aside-feed-thread-fallback"
import { BoxCardPost } from "@/interface/components/box/box-card-post"
import { BoxCardResponse } from "@/interface/components/box/box-card-response"
import { BoxFormResponse } from "@/interface/components/box/box-form-response"
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

  const responses = responsesQuery.data?.nodes ?? []

  return (
    <BoxAside title="スレッド" onClose={props.onClose}>
      <ul className="flex flex-col p-4">
        <li className="pt-2 pb-2">
          {threadQuery.data && (
            <BoxCardPost
              id={threadQuery.data.id}
              text={threadQuery.data.text}
              createdAt={threadQuery.data.createdAt}
              fileIds={threadQuery.data.fileIds}
              repliesCount={threadQuery.data.repliesCount}
              reactions={threadQuery.data.reactions}
            />
          )}
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
      <BoxFormResponse
        isLoading={createResponseMutation.isPending}
        onCreateResponse={onCreateResponse}
      />
    </BoxAside>
  )
}
