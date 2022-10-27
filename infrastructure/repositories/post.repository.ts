import { captureException } from "@sentry/node"
import { Count, Id, PostEntity, PostText } from "core"
import db from "db"

export class PostRepository {
  async find(postId: Id) {
    try {
      const prismaPost = await db.post.findUnique({
        where: { id: postId.value },
      })

      if (prismaPost === null) {
        return null
      }

      return new PostEntity({
        id: new Id(prismaPost.id),
        createdAt: prismaPost.createdAt,
        quotationsCount: new Count(prismaPost.quotationsCount),
        repliesCount: new Count(prismaPost.repliesCount),
        text: prismaPost.text ? new PostText(prismaPost.text) : null,
        fileIds: prismaPost.fileIds.map((fileId) => new Id(fileId)),
        quotationId: prismaPost.quotationId
          ? new Id(prismaPost.quotationId)
          : null,
        replyId: prismaPost.replyId ? new Id(prismaPost.replyId) : null,
        userId: prismaPost.userId ? new Id(prismaPost.userId) : null,
      })
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new Error(error.message)
      }

      throw error
    }
  }

  async persist(entity: PostEntity) {
    try {
      await db.post.upsert({
        create: {
          id: entity.id.value,
          text: entity.text?.value,
          replyId: entity.replyId?.value,
          userId: entity.userId?.value,
          fileIds: entity.fileIds?.map((id) => id.value),
          dateText: entity.dateText,
        },
        update: {},
        where: { id: entity.id.value },
      })

      if (entity.replyId) {
        await db.post.update({
          data: { repliesCount: { increment: 1 } },
          where: { id: entity.replyId.value },
        })
      }
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new Error(error.message)
      }

      throw error
    }
  }
}
