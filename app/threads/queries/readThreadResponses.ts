import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"
import { ReadResponsesQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

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
