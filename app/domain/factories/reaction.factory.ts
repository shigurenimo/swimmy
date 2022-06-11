import { ReactionEntity } from "app/domain/entities"
import { IdFactory } from "app/domain/factories/id.factory"
import { Count, Id, ReactionText } from "app/domain/valueObjects"

export class ReactionFactory {
  static create(props: { text: ReactionText; postId: Id; userId: Id | null }) {
    return new ReactionEntity({
      id: IdFactory.create(),
      text: props.text,
      postId: props.postId,
      userId: props.userId,
      count: new Count(1),
    })
  }
}
