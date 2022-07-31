import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import { Id } from "app/domain"
import db from "db"
import { InternalError } from "integrations/errors"
import { AppPost } from "integrations/types"

type Props = {
  postId: Id
  userId: Id | null
}

@injectable()
export class ReadPostQuery {
  async execute(props: Props) {
    try {
      const prismaPost = await db.post.findUnique({
        where: { id: props.postId.value },
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
                where: { id: props.userId ? props.userId.value : undefined },
              },
            },
          },
        },
      })

      if (prismaPost === null) {
        return new NotFoundError()
      }

      if (prismaPost instanceof Error) {
        return prismaPost
      }

      const appPost: AppPost = {
        id: prismaPost.id,
        createdAt: prismaPost.createdAt,
        text: prismaPost.text,
        fileIds: prismaPost.fileIds,
        likesCount: prismaPost._count?.likes ?? 0,
        repliesCount: prismaPost._count?.replies ?? 0,
        reactions: prismaPost.reactions
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
        isDeleted: prismaPost.isDeleted ?? false,
      }

      return appPost
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}