import { captureException } from "@sentry/node"
import db from "db"
import { Count } from "integrations/domain"
import { injectable } from "tsyringe"

@injectable()
export class CountPostsQuery {
  async execute() {
    try {
      const count = await db.post.count({
        where: {
          replyId: { equals: null },
        },
      })

      return new Count(count)
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new Error(error.message)
      }

      return new Error()
    }
  }
}
