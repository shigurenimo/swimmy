import { withSentry } from "app/core/utils/withSentry"
import { paginate, resolver } from "blitz"
import { CountThreadsQuery, ReadThreadsQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import * as z from "zod"

export const zReadFeedThread = z.object({ skip: z.number() })

const readFeedThread = resolver.pipe(
  resolver.zod(zReadFeedThread),
  (props, ctx) => {
    return {
      skip: props.skip,
      take: 0,
      userId: ctx.session?.userId ? new Id(ctx.session.userId) : null,
    }
  },
  async (props) => {
    const readThreadsQuery = container.resolve(ReadThreadsQuery)

    const posts = await readThreadsQuery.execute({
      skip: props.skip,
      take: props.take,
      userId: props.userId,
    })

    if (posts instanceof Error) {
      throw posts
    }

    const countThreadsQuery = container.resolve(CountThreadsQuery)

    const count = await countThreadsQuery.execute()

    if (count instanceof Error) {
      throw count
    }

    return paginate({
      skip: props.skip,
      take: props.take,
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
