import { captureException } from "@sentry/node"
import db from "db"
import { Count, Id, ReactionEntity, ReactionText } from "integrations/domain"
;``
export class ReactionRepository {
  async find(postId: Id, text: ReactionText) {
    try {
      const reaction = await db.reaction.findUnique({
        where: {
          postId_text: {
            postId: postId.value,
            text: text.value,
          },
        },
      })

      if (reaction === null) {
        return null
      }

      return new ReactionEntity({
        id: new Id(reaction.id),
        text: new ReactionText(reaction.text),
        postId: new Id(reaction.postId),
        userId: null,
        count: new Count(reaction.count),
      })
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new Error(error.message)
      }

      throw error
    }
  }

  async persist(entity: ReactionEntity) {
    try {
      if (entity.userId === null) {
        await db.reaction.upsert({
          create: {
            id: entity.id.value,
            text: entity.text.value,
            post: { connect: { id: entity.postId.value } },
            count: entity.count.value,
          },
          update: {
            id: entity.id.value,
            count: entity.count.value,
          },
          where: {
            postId_text: {
              postId: entity.postId.value,
              text: entity.text.value,
            },
          },
        })

        return null
      }

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
          count: entity.count.value,
        },
        update: {
          id: entity.id.value,
          text: entity.text.value,
          count: entity.count.value,
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

      return null
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new Error(error.message)
      }

      throw error
    }
  }
}
