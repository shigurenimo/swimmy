import { captureException } from "@sentry/node"
import db from "db"
import { Id } from "integrations/domain"
import { AppThread } from "integrations/interface/types/appThread"
import { injectable } from "tsyringe"

type Props = {
  skip: number
  take: number
  userId: Id | null
}

@injectable()
export class ReadThreadsQuery {
  async execute(props: Props) {
    try {
      const prismaPosts = await db.post.findMany({
        where: {
          repliesCount: { gt: 0 },
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
              users: {
                select: { id: true },
                where: { id: props.userId ? props.userId.value : undefined },
              },
            },
          },
        },
      })

      console.log("prismaPosts", prismaPosts.length)

      if (prismaPosts instanceof Error) {
        return prismaPosts
      }

      const appThreads = prismaPosts.map((post): AppThread => {
        return {
          id: post.id,
          createdAt: post.createdAt,
          text: post.text,
          likesCount: post._count?.likes ?? 0,
          repliesCount: post._count?.replies ?? 0,
          reactions: post.reactions
            .filter((reaction) => {
              return reaction._count?.users
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

      return appThreads
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new Error(error.message)
      }

      return new Error()
    }
  }
}
