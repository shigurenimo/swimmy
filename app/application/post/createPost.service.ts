import { captureException } from "@sentry/node"
import { Id, PostFactory, PostText } from "app/domain"
import { PostRepository } from "app/infrastructure"
import { InternalError } from "integrations/errors"
import { injectable } from "tsyringe"

type Props = {
  userId: Id | null
  replyId: Id | null
  text: PostText
  fileIds: Id[]
}

@injectable()
export class CreatePostService {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(props: Props) {
    try {
      const post = PostFactory.create({
        text: props.text,
        replyId: props.replyId,
        userId: props.userId,
        fileIds: props.fileIds,
      })

      await this.postRepository.persist(post)

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
