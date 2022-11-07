import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import { CountPostsQuery, ReadPostsQuery } from "application"
import { withSentry } from "interface/utils/withSentry"

export const zReadFeedPublic = z.object({ skip: z.number() })

const readFeedPublic = resolver.pipe(
  resolver.zod(zReadFeedPublic),
  async (props, ctx) => {
    const take = 40

    const query = container.resolve(ReadPostsQuery)

    const posts = await query.execute({
      skip: props.skip,
      take: take,
      userId: ctx.session.userId ?? null,
    })

    if (posts instanceof Error) {
      throw posts
    }

    const countQuery = container.resolve(CountPostsQuery)

    const count = await countQuery.execute()

    if (count instanceof Error) {
      throw count
    }

    return paginate({
      skip: props.skip,
      take: take,
      async count() {
        return Math.min(8 * 40, count.value)
      },
      async query() {
        return posts
      },
    })
  }
)

export default withSentry(readFeedPublic, "readFeedPublic")
