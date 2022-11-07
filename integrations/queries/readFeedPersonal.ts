import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import { CountUniquePostsQuery, ReadPrivatePostsQuery } from "application"
import { withSentry } from "interface/utils/withSentry"

export const zReadFeedPersonal = z.object({ skip: z.number() })

const readFeedPersonal = resolver.pipe(
  resolver.zod(zReadFeedPersonal),
  resolver.authorize(),
  async (props, ctx) => {
    const take = 40

    const query = container.resolve(ReadPrivatePostsQuery)

    const posts = await query.execute({
      userId: ctx.session.userId ?? null,
      skip: props.skip,
      take: take,
    })

    if (posts instanceof Error) {
      throw posts
    }

    const countQuery = container.resolve(CountUniquePostsQuery)

    const count = await countQuery.execute({
      userId: ctx.session.userId,
    })

    if (count instanceof Error) {
      throw count
    }

    return paginate({
      skip: props.skip,
      take: take,
      async count() {
        return Math.min(8 * 40, count)
      },
      async query() {
        return posts
      },
    })
  }
)

export default withSentry(readFeedPersonal, "readFeedPersonal")
