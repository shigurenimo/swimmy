import type { FC } from "react"
import { BoxPostList } from "@/components/box-post-list"
import { BoxFormPost } from "@/components/box-form-post"
import { useCreatePostMutation } from "@/hooks/use-create-post-mutation"
import type { FormNewPost } from "@/components/form-new-post"

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
