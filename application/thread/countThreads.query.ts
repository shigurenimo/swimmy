import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Count } from "core"
import db from "db"
import { InternalError } from "integrations/errors"

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
