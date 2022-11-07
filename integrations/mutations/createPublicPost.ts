import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { CreatePostService } from "application"
import { withSentry } from "interface/utils/withSentry"

const CreatePublicPost = z.object({
  replyId: z.string().nullable(),
  text: z.string().min(1).max(280),
  fileIds: z.array(z.string()),
})

const createPublicPost = resolver.pipe(
  resolver.zod(CreatePublicPost),
  async (props) => {
    const command = container.resolve(CreatePostService)

    const output = await command.execute({
      userId: null,
      replyId: props.replyId,
      fileIds: props.fileIds,
      text: props.text,
    })

    if (output instanceof Error) {
      throw output
    }

    return {}
  }
)

export default withSentry(createPublicPost, "createPost")
