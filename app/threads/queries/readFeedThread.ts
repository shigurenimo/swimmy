import { withSentry } from "app/core/utils/withSentry"
import { paginate, resolver } from "blitz"
import { CountThreadsQuery, ReadThreadsQuery } from "integrations/application"
import { Id, Skip, Take, zSkip } from "integrations/domain"
import { container } from "tsyringe"
import * as z from "zod"

const zReadFeedThread = z.object({ skip: zSkip })

const readFeedThread = resolver.pipe(
  resolver.zod(zReadFeedThread),
  (props, ctx) => {
    return {
      skip: new Skip(props.skip),
      take: new Take(),
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
      skip: props.skip.value,
      take: props.take.value,
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
