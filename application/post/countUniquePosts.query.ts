import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Count, Id } from "core"
import db from "db"
import { InternalError } from "integrations/errors"

type Props = {
  userId: Id
}

@injectable()
export class CountUniquePostsQuery {
  async execute(props: Props) {
    try {
      const count = await db.post.count({
        where: {
          replyId: { equals: null },
          userId: { equals: props.userId.value },
        },
      })

      return new Count(count)
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
