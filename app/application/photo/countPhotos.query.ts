import { captureException } from "@sentry/node"
import { Count } from "app/domain"
import db from "db"
import { InternalError } from "integrations/errors"
import { injectable } from "tsyringe"

@injectable()
export class CountPhotosQuery {
  async execute() {
    try {
      const count = await db.post.count({
        where: {
          fileIds: { isEmpty: false },
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
