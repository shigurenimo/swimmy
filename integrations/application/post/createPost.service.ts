import { captureException } from "@sentry/node"
import { Id, PostFactory, PostText } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { PostRepository } from "integrations/infrastructure"
import { injectable } from "tsyringe"

type Props = {
  userId: Id | null
  replyId: Id | null
  text: PostText
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
