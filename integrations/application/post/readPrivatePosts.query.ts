import { captureException } from "@sentry/node"
import db from "db"
import { Id, Skip, Take } from "integrations/domain"
import { AppPost } from "integrations/interface/types/appPost"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
  skip: Skip
  take: Take
}

@injectable()
export class ReadPrivatePostsQuery {
  async execute(props: Props) {
    try {
      const prismaPosts = await db.post.findMany({
        where: {
          userId: { equals: props.userId.value },
        },
        orderBy: { createdAt: "desc" },
        skip: props.skip.value,
        take: props.take.value,
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

      if (prismaPosts instanceof Error) {
        return prismaPosts
      }

      const appPosts: AppPost[] = prismaPosts.map((post): AppPost => {
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
                isConnected: false,
              }
            }),
          isDeleted: post.isDeleted ?? false,
        }
      })

      return appPosts
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new Error(error.message)
      }

      return new Error()
    }
  }
}
