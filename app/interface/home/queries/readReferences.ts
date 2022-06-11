import { ReadPostsQuery } from "app/application"
import { Id } from "app/domain"
import { withSentry } from "app/interface/core/utils/withSentry"
import { resolver } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"

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
