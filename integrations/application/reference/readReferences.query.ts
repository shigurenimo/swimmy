import { captureException } from "@sentry/node"
import db from "db"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { AppPost } from "integrations/types"
import { injectable } from "tsyringe"

type Props = {
  skip: number
  take: number
  userId: Id
}

@injectable()
export class ReadReferencesQuery {
  async execute(props: Props) {
    try {
      const prismaPosts = await db.post.findMany({
        where: {
          replyId: { equals: null },
        },
        orderBy: { createdAt: "desc" },
        skip: props.skip,
        take: props.take,
        include: {
          _count: {
            select: {
              likes: true,
              replies: true,
            },
          },
          reactions: {
            include: {
              _count: {
                select: { users: true },
              },
              users: {
                select: { id: true },
                where: { id: props.userId ? props.userId.value : undefined },
              },
            },
          },
        },
      })

      if (prismaPosts instanceof Error) {
        return prismaPosts
      }

      const appPosts = prismaPosts.map((post): AppPost => {
        return {
          id: post.id,
          createdAt: post.createdAt,
          text: post.text,
          fileIds: post.fileIds,
          likesCount: post._count?.likes ?? 0,
          repliesCount: post._count?.replies ?? 0,
          reactions: post.reactions
            .filter((reaction) => {
              return 0 < reaction.count + reaction._count?.users
            })
            .sort((a, b) => {
              return a.createdAt.getTime() - b.createdAt.getTime()
            })
            .map((reaction) => {
              return {
                id: reaction.id,
                text: reaction.text,
                count: reaction._count?.users ?? 0,
                secretCount: reaction.count,
                isConnected: 0 < reaction.users.length,
              }
            }),
          isDeleted: post.isDeleted ?? false,
        }
      })

      return appPosts
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
