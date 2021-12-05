import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"
import { ReadPrivatePostsQuery } from "integrations/application"
import { Id, Skip, Take, zSkip } from "integrations/domain"
import { container } from "tsyringe"
import * as z from "zod"

const zReadFeedPersonal = z.object({ skip: zSkip })

const readFeedPersonal = resolver.pipe(
  resolver.zod(zReadFeedPersonal),
  resolver.authorize(),
  (props, ctx) => {
    return {
      userId: new Id(ctx.session.userId),
      skip: new Skip(props.skip),
      take: new Take(),
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

    return { posts }
  }
)

export default withSentry(readFeedPersonal, "readFeedPersonal")
