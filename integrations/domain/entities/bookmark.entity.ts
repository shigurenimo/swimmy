import { Id } from "integrations/domain/valueObjects"
import * as z from "zod"

export const zBookmarkProps = z.object({
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

  constructor(public props: z.infer<typeof zBookmarkProps>) {
    zBookmarkProps.parse(props)
    Object.assign(this, props)
    Object.freeze(this)
  }
}
