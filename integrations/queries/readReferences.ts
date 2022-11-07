import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { ReadPostsQuery } from "application"
import { withSentry } from "interface/utils/withSentry"

const zReadReferences = z.object({ skip: z.number() })

const readReferences = resolver.pipe(
  resolver.zod(zReadReferences),
  async (props, ctx) => {
    const take = 8

    const query = container.resolve(ReadPostsQuery)

    const posts = await query.execute({
      skip: props.skip,
      take: take,
      userId: ctx.session.userId,
    })

    return { posts }
  }
)

export default withSentry(readReferences, "readReferences")
