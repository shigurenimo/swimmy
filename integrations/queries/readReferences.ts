import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { ReadPostsQuery } from "application"
import { Id } from "core"
import { withSentry } from "interface/utils/withSentry"

const zReadReferences = z.object({ skip: z.number() })

const readReferences = resolver.pipe(
  resolver.zod(zReadReferences),
  (props, ctx) => {
    return {
      skip: props.skip,
      take: 8,
      userId: ctx.session?.userId ? new Id(ctx.session.userId) : null,
    }
  },
  async (props) => {
    const readPostsQuery = container.resolve(ReadPostsQuery)

    const posts = await readPostsQuery.execute({
      skip: props.skip,
      take: props.take,
      userId: props.userId,
    })

    return { posts }
  }
)

export default withSentry(readReferences, "readReferences")
