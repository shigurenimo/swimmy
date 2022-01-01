import { captureException } from "@sentry/node"
import db from "db"
import { Count, Id } from "integrations/domain"
import { injectable } from "tsyringe"

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
        return new Error(error.message)
      }

      return new Error()
    }
  }
}
