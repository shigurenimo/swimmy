import { CreatePostService } from "app/application"
import { Id, PostText } from "app/domain"
import { withSentry } from "app/interface/utils/withSentry"
import { resolver } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"

const CreatePublicPost = z.object({
  replyId: z.string().nullable(),
  text: z.string().min(1).max(280),
  fileIds: z.array(z.string()),
})

const createPublicPost = resolver.pipe(
  resolver.zod(CreatePublicPost),
  (props) => {
    return {
      replyId: props.replyId ? new Id(props.replyId) : null,
      text: new PostText(props.text),
      fileIds: props.fileIds ? props.fileIds.map((id) => new Id(id)) : [],
    }
  },
  async (props) => {
    const createPostService = container.resolve(CreatePostService)

    await createPostService.execute({
      userId: null,
      replyId: props.replyId,
      fileIds: props.fileIds,
      text: props.text,
    })

    return {}
  }
)

export default withSentry(createPublicPost, "createPost")
