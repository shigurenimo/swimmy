import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import {
  CreateReactionService,
  CreateSecretReactionService,
  ReadPostQuery,
} from "application"
import { withSentry } from "interface/utils/withSentry"

const zProps = z.object({
  postId: z.string(),
  text: z.string().min(1).max(280),
})

const createReaction = resolver.pipe(
  resolver.zod(zProps),
  async (props, ctx) => {
    if (ctx.session.userId === null) {
      const command = container.resolve(CreateSecretReactionService)

      await command.execute({
        text: props.text,
        postId: props.postId,
      })
    }

    if (ctx.session.userId !== null) {
      const command = container.resolve(CreateReactionService)

      await command.execute({
        text: props.text,
        userId: ctx.session.userId,
        postId: props.postId,
      })
    }

    const query = container.resolve(ReadPostQuery)

    const post = await query.execute({
      postId: props.postId,
      userId: ctx.session.userId,
    })

    if (post instanceof Error) {
      throw post
    }

    return { post }
  }
)

export default withSentry(createReaction, "createReaction")
