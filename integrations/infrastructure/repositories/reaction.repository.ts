import { captureException } from "@sentry/node"
import db from "db"
import { ReactionEntity } from "integrations/domain"

export class ReactionRepository {
  async persist(entity: ReactionEntity) {
    try {
      const reaction = await db.reaction.findUnique({
        where: {
          postId_text: {
            postId: entity.postId.value,
            text: entity.text.value,
          },
        },
        include: {
          users: {
            where: { id: entity.userId.value },
          },
        },
      })

      const isConnected = reaction?.users.length !== 0

      await db.reaction.upsert({
        create: {
          id: entity.id.value,
          text: entity.text.value,
          post: { connect: { id: entity.postId.value } },
          users: { connect: { id: entity.userId.value } },
        },
        update: {
          id: entity.id.value,
          text: entity.text.value,
          users: isConnected
            ? { disconnect: { id: entity.userId.value } }
            : { connect: { id: entity.userId.value } },
        },
        where: {
          postId_text: {
            postId: entity.postId.value,
            text: entity.text.value,
          },
        },
      })
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new Error(error.message)
      }

      throw error
    }
  }
}
