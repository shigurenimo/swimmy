import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id, ReactionFactory, ReactionText } from "core"
import { ReactionRepository } from "infrastructure"
import { InternalError } from "infrastructure/errors"

type Props = {
  userId: string
  postId: string
  text: string
}

@injectable()
export class CreateReactionService {
  constructor(private readonly reactionRepository: ReactionRepository) {}

  async execute(props: Props) {
    try {
      const reaction = ReactionFactory.create({
        text: new ReactionText(props.text),
        postId: new Id(props.postId),
        userId: new Id(props.userId),
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
