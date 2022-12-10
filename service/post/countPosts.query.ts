import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import db from "db"
import { InternalError } from "infrastructure/errors"

@injectable()
export class CountPostsQuery {
  async execute() {
    try {
      const count = await db.post.count({
        where: {
          replyId: { equals: null },
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
