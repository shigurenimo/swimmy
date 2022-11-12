import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import db from "db"
import { InternalError } from "integrations/errors"
import { PostNode } from "interface/__generated__/node"

type Props = {
  threadId: string
}

@injectable()
export class ReadResponsesQuery {
  async execute(props: Props) {
    try {
      const posts = await db.post.findMany({
        orderBy: { createdAt: "asc" },
        where: { replyId: props.threadId },
      })

      const nodes = posts.map((post): PostNode => {
        return {
          id: post.id,
          createdAt: Math.floor(post.createdAt.getTime() / 1000),
          text: post.text,
          fileIds: post.fileIds,
          likesCount: 0,
          repliesCount: 0,
          reactions: [],
          isDeleted: post.isDeleted ?? false,
        }
      })

      return nodes
    } catch (error) {
      captureException(error)
      if (error instanceof Error) {
        return new InternalError(error.message)
      }
      return new InternalError()
    }
  }
}
