import { Count, Id, PostText } from "integrations/domain/valueObjects"
import { z } from "zod"

const zProps = z.object({
  id: z.instanceof(Id),
  quotationId: z.instanceof(Id).nullable(),
  quotationsCount: z.instanceof(Count),
  repliesCount: z.instanceof(Count),
  replyId: z.instanceof(Id).nullable(),
  text: z.instanceof(PostText).nullable(),
  userId: z.instanceof(Id).nullable(),
  fileIds: z.array(z.instanceof(Id)),
  createdAt: z.instanceof(Date),
})

/**
 * 投稿
 */
export class PostEntity {
  /**
   * ID
   */
  readonly id!: Id

  /**
   * 引用のID
   */
  readonly quotationId!: Id | null

  /**
   * 引用された回数
   */
  readonly quotationsCount!: Count

  /**
   * 返信された回数
   */
  readonly repliesCount!: Count

  /**
   * 返信先のID
   */
  readonly replyId!: Id | null

  /**
   * 文章
   */
  readonly text!: PostText | null

  /**
   * 作成したユーザーのID
   */
  readonly userId!: Id | null

  /**
   * 関連付けされたファイルのID
   */
  readonly fileIds!: Id[]

  /**
   * 作成日
   */
  readonly createdAt!: Date

  constructor(public props: z.infer<typeof zProps>) {
    zProps.parse(props)
    Object.assign(this, props)
    Object.freeze(this)
  }

  get dateText() {
    return [
      this.createdAt.getFullYear(),
      this.createdAt.getMonth() + 1,
      this.createdAt.getDate(),
    ].join("-")
  }
}
