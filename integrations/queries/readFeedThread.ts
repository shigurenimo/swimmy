import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import { CountThreadsQuery, ReadThreadsQuery } from "application"
import { withSentry } from "interface/utils/withSentry"

export const zReadFeedThread = z.object({ skip: z.number() })

const readFeedThread = resolver.pipe(
  resolver.zod(zReadFeedThread),
  async (props, ctx) => {
    const take = 8

    const readThreadsQuery = container.resolve(ReadThreadsQuery)

    const posts = await readThreadsQuery.execute({
      skip: props.skip,
      take: take,
      userId: ctx.session.userId,
    })

    if (posts instanceof Error) {
      throw posts
    }

    const countQuery = container.resolve(CountThreadsQuery)

    const count = await countQuery.execute()

    if (count instanceof Error) {
      throw count
    }

    return paginate({
      skip: props.skip,
      take: take,
      async count() {
        return count.value
      },
      async query() {
        return posts
      },
    })
  }
)

export default withSentry(readFeedThread, "readFeedThread")
