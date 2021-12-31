import { captureException } from "@sentry/node"
import db from "db"
import { PostEntity } from "integrations/domain"

export class PostRepository {
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
