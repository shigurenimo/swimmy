import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import db from "db"
import { InternalError } from "integrations/errors"

type Props = {
  userId: string
}

@injectable()
export class CountUniquePostsQuery {
  async execute(props: Props) {
    try {
      const count = await db.post.count({
        where: {
          replyId: { equals: null },
          userId: { equals: props.userId },
        },
      })

      return count
    } catch (error) {
      captureException(error)
      if (error instanceof Error) {
        return new InternalError(error.message)
      }
      return new InternalError()
    }
  }
}
