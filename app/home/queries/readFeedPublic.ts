import { withSentry } from "app/core/utils/withSentry"
import { paginate, resolver } from "blitz"
import { CountPostsQuery, ReadPostsQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import * as z from "zod"

export const zReadFeedPublic = z.object({ skip: z.number() })

const readFeedPublic = resolver.pipe(
  resolver.zod(zReadFeedPublic),
  (props, ctx) => {
    return {
      skip: props.skip,
      take: 40,
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

    const countPostsQuery = container.resolve(CountPostsQuery)

    const count = await countPostsQuery.execute()

    if (count instanceof Error) {
      throw count
    }

    return paginate({
      skip: props.skip,
      take: props.take,
      async count() {
        return Math.min(8 * 40, count.value)
      },
      async query() {
        return posts
      },
    })
  }
)

export default withSentry(readFeedPublic, "readPublicFeed")
