import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"
import { CreateReactionService, ReadPostQuery } from "integrations/application"
import { Id, PostText, zId, zPostText } from "integrations/domain"
import { container } from "tsyringe"
import * as z from "zod"

const CreateReaction = z.object({
  postId: zId,
  text: zPostText,
})

const createReaction = resolver.pipe(
  resolver.zod(CreateReaction),
  resolver.authorize(),
  (props, ctx) => {
    return {
      text: new PostText(props.text),
      postId: new Id(props.postId),
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const createReactionService = container.resolve(CreateReactionService)

    await createReactionService.execute({
      text: props.text,
      userId: props.userId,
      postId: props.postId,
    })

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
