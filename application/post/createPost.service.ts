import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id, PostFactory, PostText } from "core"
import { PostRepository } from "infrastructure"
import { InternalError } from "integrations/errors"

type Props = {
  userId: string | null
  replyId: string | null
  text: string
  fileIds: string[]
}

@injectable()
export class CreatePostService {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(props: Props) {
    try {
      const draftPost = PostFactory.create({
        text: new PostText(props.text),
        replyId: props.replyId ? new Id(props.replyId) : null,
        userId: props.userId ? new Id(props.userId) : null,
        fileIds: props.fileIds.map((fileId) => new Id(fileId)),
      })

      const transaction = await this.postRepository.persist(draftPost)

      if (transaction instanceof Error) {
        return new InternalError("投稿に失敗しました")
      }

      return null
    } catch (error) {
      captureException(error)
      if (error instanceof Error) {
        return new InternalError(error.message)
      }
      return new InternalError()
    }
  }
}
