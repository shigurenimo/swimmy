import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import db from "db"
import { InternalError } from "integrations/errors"
import { AppResponse } from "integrations/types/appResponse"

type Props = {
  replyId: string
}

@injectable()
export class ReadResponsesQuery {
  async execute(props: Props) {
    try {
      const prismaPosts = await db.post.findMany({
        orderBy: { createdAt: "asc" },
        where: { replyId: props.replyId },
      })

      if (prismaPosts instanceof Error) {
        return prismaPosts
      }

      const appResponses = prismaPosts.map((post): AppResponse => {
        return {
          id: post.id,
          createdAt: post.createdAt,
          text: post.text,
          fileIds: post.fileIds,
          likesCount: 0,
          repliesCount: 0,
          reactions: [],
          isDeleted: post.isDeleted ?? false,
        }
      })

      return appResponses
    } catch (error) {
      captureException(error)
      if (error instanceof Error) {
        return new InternalError(error.message)
      }
      return new InternalError()
    }
  }
}
