import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { ReadPostQuery } from "application"
import { withSentry } from "interface/utils/withSentry"

export const zReadPost = z.object({ postId: z.string() })

const readPost = resolver.pipe(resolver.zod(zReadPost), async (props, ctx) => {
  const query = container.resolve(ReadPostQuery)

  const post = await query.execute({
    postId: props.postId,
    userId: ctx.session.userId,
  })

  if (post instanceof Error) {
    throw post
  }

  return { post }
})

export default withSentry(readPost, "readPost")
