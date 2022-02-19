import { captureException } from "@sentry/node"
import db from "db"
import { Count } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { injectable } from "tsyringe"

@injectable()
export class CountThreadsQuery {
  async execute() {
    try {
      const count = await db.post.count({
        where: {
          repliesCount: { gt: 0 },
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
