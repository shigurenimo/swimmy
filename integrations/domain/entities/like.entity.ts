import { Id } from "integrations/domain/valueObjects"
import * as z from "zod"

export const zLikeProps = z.object({
  id: z.instanceof(Id),
  postId: z.instanceof(Id),
  userId: z.instanceof(Id),
})

/**
 * 投稿に対するイイネ
 */
export class LikeEntity {
  /**
   * ID
   */
  readonly id!: Id

  /**
   * 投稿のID
   */
  readonly postId!: Id

  /**
   * いいねしたユーザーのID
   */
  readonly userId!: Id

  constructor(public props: z.infer<typeof zLikeProps>) {
    zLikeProps.parse(props)
    Object.assign(this, props)
    Object.freeze(this)
  }
}
