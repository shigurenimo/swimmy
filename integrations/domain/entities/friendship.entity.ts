import { Id } from "integrations/domain/valueObjects"
import * as z from "zod"

export const zFriendshipProps = z.object({
  id: z.instanceof(Id),
  followeeId: z.instanceof(Id),
  followerId: z.instanceof(Id),
})

/**
 * フォロー関係
 */
export class FriendshipEntity {
  /**
   * ID
   */
  readonly id!: Id

  /**
   * フォローされているユーザーのID
   */
  readonly followeeId!: Id

  /**
   * フォローしているユーザーのID
   */
  readonly followerId!: Id

  constructor(public props: z.infer<typeof zFriendshipProps>) {
    zFriendshipProps.parse(props)
    Object.assign(this, props)
    Object.freeze(this)
  }
}
