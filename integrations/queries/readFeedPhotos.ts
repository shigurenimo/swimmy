import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import { CountPhotosQuery, ReadPhotosQuery } from "application"
import { withSentry } from "interface/utils/withSentry"

export const zReadFeedPhotos = z.object({ skip: z.number() })

const readFeedPhotos = resolver.pipe(
  resolver.zod(zReadFeedPhotos),
  async (props, ctx) => {
    const take = 40

    const query = container.resolve(ReadPhotosQuery)

    const posts = await query.execute({
      userId: ctx.session.userId ?? null,
      skip: props.skip,
      take: take,
    })

    if (posts instanceof Error) {
      throw posts
    }

    const countQuery = container.resolve(CountPhotosQuery)

    const count = await countQuery.execute()

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

export default withSentry(readFeedPhotos, "readFeedPhotos")
