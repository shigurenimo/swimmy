import { z } from "zod"
import { Id } from "app/domain/valueObjects"

const zProps = z.object({
  id: z.instanceof(Id),
  createdAt: z.instanceof(Date),
  postId: z.instanceof(Id),
  userId: z.instanceof(Id),
})

/**
 * ブックマーク
 */
export class BookmarkEntity {
  /**
   * ID
   */
  readonly id!: Id

  /**
   * 作成日
   */
  readonly createdAt!: Date

  /**
   * ブックマークした投稿のID
   */
  readonly postId!: Id

  /**
   * ブックマークしたユーザーのID
   */
  readonly userId!: Id

  constructor(public props: z.infer<typeof zProps>) {
    zProps.parse(props)
    Object.assign(this, props)
    Object.freeze(this)
  }
}
