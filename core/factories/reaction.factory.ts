import { ReactionEntity } from "core/entities"
import { IdFactory } from "core/factories/id.factory"
import { Count, Id, ReactionText } from "core/valueObjects"

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
