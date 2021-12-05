import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"
import { CreatePostService } from "integrations/application"
import { Id, PostText, zId, zPostText } from "integrations/domain"
import { container } from "tsyringe"
import * as z from "zod"

const CreatePost = z.object({
  replyId: zId.nullable(),
  text: zPostText,
})

const createPost = resolver.pipe(
  resolver.zod(CreatePost),
  (props, ctx) => {
    return {
      replyId: props.replyId ? new Id(props.replyId) : null,
      text: new PostText(props.text),
      userId: ctx.session.userId ? new Id(ctx.session.userId) : null,
    }
  },
  async (props) => {
    const createPostService = container.resolve(CreatePostService)

    await createPostService.execute({
      userId: props.userId,
      replyId: props.replyId,
      text: props.text,
    })

    return {}
  }
)

export default withSentry(createPost, "createPost")
