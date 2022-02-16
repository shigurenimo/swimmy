import { withSentry } from "app/core/utils/withSentry"
import { paginate, resolver } from "blitz"
import {
  CountUniquePostsQuery,
  ReadPrivatePostsQuery,
} from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

export const zReadFeedPersonal = z.object({ skip: z.number() })

const readFeedPersonal = resolver.pipe(
  resolver.zod(zReadFeedPersonal),
  resolver.authorize(),
  (props, ctx) => {
    return {
      userId: new Id(ctx.session.userId),
      skip: props.skip,
      take: 40,
    }
  },
  async (props) => {
    const readPrivatePostsQuery = container.resolve(ReadPrivatePostsQuery)

    const posts = await readPrivatePostsQuery.execute({
      userId: props.userId,
      skip: props.skip,
      take: props.take,
    })

    if (posts instanceof Error) {
      throw posts
    }

    const countUniquePostsQuery = container.resolve(CountUniquePostsQuery)

    const count = await countUniquePostsQuery.execute({ userId: props.userId })

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

export default withSentry(readFeedPersonal, "readFeedPersonal")
