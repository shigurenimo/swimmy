import { PostEntity } from "core/entities"
import { IdFactory } from "core/factories/id.factory"
import { Count, Id, PostText } from "core/valueObjects"

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
