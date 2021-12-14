import { withSentry } from "app/core/utils/withSentry"
import { paginate, resolver } from "blitz"
import { CountPhotosQuery, ReadPhotosQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import * as z from "zod"

export const zReadFeedPhotos = z.object({ skip: z.number() })

const readFeedPhotos = resolver.pipe(
  resolver.zod(zReadFeedPhotos),
  (props, ctx) => {
    return {
      skip: props.skip,
      take: 40,
      userId: ctx.session?.userId ? new Id(ctx.session.userId) : null,
    }
  },
  async (props) => {
    const readPhotosQuery = container.resolve(ReadPhotosQuery)

    const posts = await readPhotosQuery.execute({
      userId: props.userId,
      skip: props.skip,
      take: props.take,
    })

    if (posts instanceof Error) {
      throw posts
    }

    const countPhotosQuery = container.resolve(CountPhotosQuery)

    const count = await countPhotosQuery.execute()

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

export default withSentry(readFeedPhotos, "readFeedPhotos")
