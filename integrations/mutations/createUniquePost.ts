import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { CreatePostService } from "application"
import { withSentry } from "interface/utils/withSentry"

const CreateUniquePost = z.object({
  replyId: z.string().nullable(),
  text: z.string().min(1).max(280),
  fileIds: z.array(z.string()),
})

const createUniquePost = resolver.pipe(
  resolver.zod(CreateUniquePost),
  resolver.authorize(),
  async (props, ctx) => {
    const command = container.resolve(CreatePostService)

    await command.execute({
      userId: ctx.session.userId,
      replyId: props.replyId,
      fileIds: props.fileIds,
      text: props.text,
    })

    return {}
  }
)

export default withSentry(createUniquePost, "createPost")
