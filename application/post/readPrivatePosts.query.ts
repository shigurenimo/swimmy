import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import db from "db"
import { InternalError } from "integrations/errors"
import { PostNode } from "interface/__generated__/node"

type Props = {
  userId: string
  cursor: string | null
  take: number
}

@injectable()
export class ReadPrivatePostsQuery {
  async execute(props: Props) {
    try {
      const posts = await db.post.findMany({
        where: {
          userId: { equals: props.userId },
        },
        orderBy: { createdAt: "desc" },
        skip: props.cursor ? 1 : 0,
        cursor: props.cursor ? { id: props.cursor } : undefined,
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
            },
          },
        },
      })

      if (posts instanceof Error) {
        return posts
      }

      const nodes = posts.map((post): PostNode => {
        return {
          id: post.id,
          createdAt: Math.floor(post.createdAt.getTime() / 1000),
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
                isConnected: false,
              }
            }),
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
