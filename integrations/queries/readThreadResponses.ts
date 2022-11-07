import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { ReadResponsesQuery } from "application"
import { withSentry } from "interface/utils/withSentry"

export const zReadThreadResponses = z.object({ postId: z.string() })

const readThreadResponses = resolver.pipe(
  resolver.zod(zReadThreadResponses),
  async (props) => {
    const query = container.resolve(ReadResponsesQuery)

    const posts = await query.execute({ replyId: props.postId })

    if (posts instanceof Error) {
      throw posts
    }

    return { posts }
  }
)

export default withSentry(readThreadResponses, "readThreadResponses")
