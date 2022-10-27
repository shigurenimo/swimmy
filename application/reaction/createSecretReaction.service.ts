import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id, ReactionFactory, ReactionText } from "core"
import { ReactionRepository } from "infrastructure"
import { InternalError } from "integrations/errors"

type Props = {
  postId: Id
  text: ReactionText
}

@injectable()
export class CreateSecretReactionService {
  constructor(private reactionRepository: ReactionRepository) {}

  async execute(props: Props) {
    try {
      const reaction = await this.reactionRepository.find(
        props.postId,
        props.text
      )

      if (reaction instanceof Error) {
        return new InternalError()
      }

      if (reaction === null) {
        const nextReaction = ReactionFactory.create({
          text: props.text,
          postId: props.postId,
          userId: null,
        })

        await this.reactionRepository.persist(nextReaction)

        return null
      }

      const nextReaction = reaction.incrementCount()

      await this.reactionRepository.persist(nextReaction)

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
