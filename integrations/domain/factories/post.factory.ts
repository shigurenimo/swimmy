import { PostEntity } from "integrations/domain/entities"
import { IdFactory } from "integrations/domain/factories/id.factory"
import { Count, Id, PostText } from "integrations/domain/valueObjects"

export class PostFactory {
  static create(props: {
    text: PostText
    replyId: Id | null
    userId: Id | null
  }) {
    return new PostEntity({
      id: IdFactory.create(),
      quotationId: null,
      quotationsCount: new Count(0),
      repliesCount: new Count(0),
      replyId: props.replyId,
      text: props.text,
      userId: props.userId,
      fileIds: [],
      createdAt: new Date(),
    })
  }
}
