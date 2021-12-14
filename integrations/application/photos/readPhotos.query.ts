import { captureException } from "@sentry/node"
import db from "db"
import { Id } from "integrations/domain"
import { AppPhoto } from "integrations/interface/types/appPhoto"
import { injectable } from "tsyringe"

type Props = {
  skip: number
  take: number
  userId: Id | null
}

@injectable()
export class ReadPhotosQuery {
  async execute(props: Props) {
    try {
      const prismaPosts = await db.post.findMany({
        where: {
          fileIds: { isEmpty: false },
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
                select: {
                  users: true,
                },
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

      const appPhotos = prismaPosts.map((post): AppPhoto => {
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
          fileIds: post.fileIds,
          isDeleted: post.isDeleted ?? false,
        }
      })

      return appPhotos
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new Error(error.message)
      }

      return new Error()
    }
  }
}
