import { captureException } from "@sentry/node"
import { Id, ReactionFactory, ReactionText } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { ReactionRepository } from "integrations/infrastructure"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
  postId: Id
  text: ReactionText
}

@injectable()
export class CreateReactionService {
  constructor(private readonly reactionRepository: ReactionRepository) {}

  async execute(props: Props) {
    try {
      const reaction = ReactionFactory.create({
        text: props.text,
        postId: props.postId,
        userId: props.userId,
      })

      await this.reactionRepository.persist(reaction)

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
