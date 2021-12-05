import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"
import { ReadPostsQuery } from "integrations/application"
import { Id, Skip, Take, zSkip } from "integrations/domain"
import { container } from "tsyringe"
import * as z from "zod"

const zReadReferences = z.object({ skip: zSkip })

const readReferences = resolver.pipe(
  resolver.zod(zReadReferences),
  (props, ctx) => {
    return {
      skip: new Skip(props.skip),
      take: new Take(),
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
