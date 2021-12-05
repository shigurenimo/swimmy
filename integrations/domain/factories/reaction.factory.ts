import { ReactionEntity } from "integrations/domain/entities"
import { IdFactory } from "integrations/domain/factories/id.factory"
import { Id, ReactionText } from "integrations/domain/valueObjects"

export class ReactionFactory {
  static create(props: { text: ReactionText; postId: Id; userId: Id }) {
    return new ReactionEntity({
      id: IdFactory.create(),
      text: props.text,
      postId: props.postId,
      userId: props.userId,
    })
  }
}
