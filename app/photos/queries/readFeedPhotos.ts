import { withSentry } from "app/core/utils/withSentry"
import { paginate, resolver } from "blitz"
import { CountPhotosQuery, ReadPhotosQuery } from "integrations/application"
import { Id, Skip, Take, zSkip } from "integrations/domain"
import { container } from "tsyringe"
import * as z from "zod"

const zReadFeedPhotos = z.object({ skip: zSkip })

const readFeedPhotos = resolver.pipe(
  resolver.zod(zReadFeedPhotos),
  (props, ctx) => {
    return {
      skip: new Skip(props.skip),
      take: new Take(),
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

export default withSentry(readFeedPhotos, "readFeedPhotos")
