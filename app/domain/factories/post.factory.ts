import { PostEntity } from "app/domain/entities"
import { IdFactory } from "app/domain/factories/id.factory"
import { Count, Id, PostText } from "app/domain/valueObjects"

export class PostFactory {
  static create(props: {
    text: PostText
    replyId: Id | null
    userId: Id | null
    fileIds: Id[]
  }) {
    return new PostEntity({
      id: IdFactory.create(),
      quotationId: null,
      quotationsCount: new Count(0),
      repliesCount: new Count(0),
      replyId: props.replyId,
      text: props.text,
      userId: props.userId,
      fileIds: props.fileIds,
      createdAt: new Date(),
    })
  }
}
