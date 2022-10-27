import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { CreatePostService } from "application"
import { Id, PostText } from "core"
import { withSentry } from "interface/utils/withSentry"

const CreateUniquePost = z.object({
  replyId: z.string().nullable(),
  text: z.string().min(1).max(280),
  fileIds: z.array(z.string()),
})

const createUniquePost = resolver.pipe(
  resolver.zod(CreateUniquePost),
  resolver.authorize(),
  (props, ctx) => {
    return {
      replyId: props.replyId ? new Id(props.replyId) : null,
      text: new PostText(props.text),
      fileIds: props.fileIds ? props.fileIds.map((id) => new Id(id)) : [],
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const createPostService = container.resolve(CreatePostService)

    await createPostService.execute({
      userId: props.userId,
      replyId: props.replyId,
      fileIds: props.fileIds,
      text: props.text,
    })

    return {}
  }
)

export default withSentry(createUniquePost, "createPost")
