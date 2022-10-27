import { z } from "zod"
import { Email, Id, Token } from "core/valueObjects"

const zProps = z.object({
  id: z.instanceof(Id),
  discoverableByEmail: z.boolean(),
  fcmToken: z.instanceof(Token).nullable(),
  fcmTokenForMobile: z.instanceof(Token).nullable(),
  notificationEmail: z.instanceof(Email).nullable(),
  protected: z.boolean(),
  subscribeMessage: z.boolean(),
  subscribePostLike: z.boolean(),
  subscribePostQuotation: z.boolean(),
  userId: z.instanceof(Id),
})

/**
 * 設定
 */
export class SettingEntity {
  /**
   * ID
   */
  readonly id!: Id

  /**
   * 未定義
   */
  readonly discoverableByEmail!: boolean

  /**
   * FCMトークン
   *
   * ブラウザ通知を受け取る為に使用します。
   */
  readonly fcmToken!: string | null

  /**
   * FCMトークン（モバイル用）
   */
  readonly fcmTokenForMobile!: string | null

  /**
   * 未定義
   */
  readonly notificationEmail!: Email | null

  /**
   * 未定義
   */
  readonly protected!: boolean

  /**
   * 未定義
   */
  readonly subscribeMessage!: boolean

  /**
   * 未定義
   */
  readonly subscribePostLike!: boolean

  /**
   * 未定義
   */
  readonly subscribePostQuotation!: boolean

  /**
   * ユーザーID
   */
  readonly userId!: Id

  constructor(public props: z.infer<typeof zProps>) {
    zProps.parse(props)
    Object.assign(this, props)
    Object.freeze(this)
  }
}
