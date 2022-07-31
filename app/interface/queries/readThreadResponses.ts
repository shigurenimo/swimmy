import { resolver } from "@blitzjs/rpc";
import { ReadResponsesQuery } from "app/application"
import { Id } from "app/domain"
import { withSentry } from "app/interface/utils/withSentry"
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
