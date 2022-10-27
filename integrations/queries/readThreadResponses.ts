import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { ReadResponsesQuery } from "application"
import { Id } from "core"
import { withSentry } from "interface/utils/withSentry"

export const zReadThreadResponses = z.object({ postId: z.string() })

const readThreadResponses = resolver.pipe(
  resolver.zod(zReadThreadResponses),
  (props) => {
    return {
      postId: new Id(props.postId),
    }
  },
  async (props) => {
    const readResponsesQuery = container.resolve(ReadResponsesQuery)

    const posts = await readResponsesQuery.execute({ replyId: props.postId })

    if (posts instanceof Error) {
      throw posts
    }

    return { posts }
  }
)

export default withSentry(readThreadResponses, "readThreadResponses")
