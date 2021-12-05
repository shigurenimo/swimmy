import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"
import { ReadPostsQuery } from "integrations/application"
import { Id, Skip, Take, zSkip } from "integrations/domain"
import { container } from "tsyringe"
import * as z from "zod"

const zReadPublicFeed = z.object({ skip: zSkip })

const readFeedPublic = resolver.pipe(
  resolver.zod(zReadPublicFeed),
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

    if (posts instanceof Error) {
      throw posts
    }

    return { posts }
  }
)

export default withSentry(readFeedPublic, "readPublicFeed")
