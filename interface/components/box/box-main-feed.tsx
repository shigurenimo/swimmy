"use client"

import type { FC } from "react"
import { BoxPostList } from "@/interface/components/box/box-post-list"
import { BoxFormPost } from "@/interface/components/box/box-form-post"
import { useCreatePostMutation } from "@/interface/hooks/use-create-post-mutation"
import type { FormNewPost } from "@/interface/types/form-new-post"

type Props = {
  threadId: string | null
}

export const BoxMainFeed: FC<Props> = (props) => {
  const createPostMutation = useCreatePostMutation()

  const onCreatePost = async (value: FormNewPost) => {
    await createPostMutation.mutateAsync({
      text: value.text,
      fileIds: value.fileIds,
      threadId: null,
    })
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <BoxFormPost isLoading={createPostMutation.isPending} onCreatePost={onCreatePost} />
      <BoxPostList threadId={props.threadId} resource="posts" />
    </div>
  )
}
