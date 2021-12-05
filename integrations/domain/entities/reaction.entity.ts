import { Id, PostText, ReactionText } from "integrations/domain/valueObjects"
import * as z from "zod"

export const zReactionProps = z.object({
  id: z.instanceof(Id),
  text: z.instanceof(PostText),
  postId: z.instanceof(Id),
  userId: z.instanceof(Id),
})

/**
 * 投稿
 */
export class ReactionEntity {
  /**
   * ID
   */
  readonly id!: Id

  /**
   * 投稿のID
   */
  readonly postId!: Id

  /**
   * テキスト
   */
  readonly text!: ReactionText

  /**
   * ユーザーのID
   */
  readonly userId!: Id

  constructor(public props: z.infer<typeof zReactionProps>) {
    zReactionProps.parse(props)
    Object.assign(this, props)
    Object.freeze(this)
  }
}
