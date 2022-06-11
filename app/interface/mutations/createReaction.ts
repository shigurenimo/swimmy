import {
  CreateReactionService,
  CreateSecretReactionService,
  ReadPostQuery,
} from "app/application"
import { Id, ReactionText } from "app/domain"
import { withSentry } from "app/interface/utils/withSentry"
import { resolver } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"

const zProps = z.object({
  postId: z.string(),
  text: z.string().min(1).max(280),
})

const createReaction = resolver.pipe(
  resolver.zod(zProps),
  (props, ctx) => {
    return {
      text: new ReactionText(props.text),
      postId: new Id(props.postId),
      userId: ctx.session.userId ? new Id(ctx.session.userId) : null,
    }
  },
  async (props) => {
    if (props.userId === null) {
      const createSecretReactionService = container.resolve(
        CreateSecretReactionService
      )

      await createSecretReactionService.execute({
        text: props.text,
        postId: props.postId,
      })
    }

    if (props.userId !== null) {
      const createReactionService = container.resolve(CreateReactionService)

      await createReactionService.execute({
        text: props.text,
        userId: props.userId,
        postId: props.postId,
      })
    }

    const readPostQuery = container.resolve(ReadPostQuery)

    const post = await readPostQuery.execute({
      postId: props.postId,
      userId: props.userId,
    })

    if (post instanceof Error) {
      throw post
    }

    return { post }
  }
)

export default withSentry(createReaction, "createReaction")
