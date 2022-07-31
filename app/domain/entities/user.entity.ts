import { z } from "zod"
import {
  Biography,
  Email,
  Id,
  LoginProvider,
  Name,
  Username,
} from "app/domain/valueObjects"

const zProps = z.object({
  id: z.instanceof(Id),
  email: z.instanceof(Email).nullable(),
  username: z.instanceof(Username),
  name: z.instanceof(Name).nullable(),
  biography: z.instanceof(Biography),
  headerImageId: z.instanceof(Id).nullable(),
  iconImageId: z.instanceof(Id).nullable(),
  loginProvider: z.instanceof(LoginProvider),
})

/**
 * ユーザー
 */
export class UserEntity {
  /**
   * ID
   */
  readonly id!: Id

  /**
   * メールアドレス（非公開）
   */
  readonly email!: Email | null

  /**
   * ユーザーID
   */
  readonly username!: Username

  /**
   * 表示名
   */
  readonly name!: Name | null

  /**
   * 自己紹介
   */
  readonly biography!: Biography

  /**
   * ヘッダー画像
   */
  readonly headerImageId!: Id | null

  /**
   * アイコン画像
   */
  readonly iconImageId!: Id | null

  /**
   * ログイン・プロバイダ
   */
  readonly loginProvider!: LoginProvider

  constructor(public props: z.infer<typeof zProps>) {
    zProps.parse(props)
    Object.assign(this, props)
    Object.freeze(this)
  }

  updateEmail(email: Email) {
    return new UserEntity({ ...this.props, email })
  }

  updateUsername(username: Username) {
    return new UserEntity({ ...this.props, username })
  }

  update(input: {
    headerImageId?: Id
    iconImageId?: Id
    name: Name
    biography: Biography
  }) {
    return new UserEntity({
      ...this.props,
      biography: input.biography ?? this.biography,
      name: input.name ?? this.name,
      headerImageId: input.iconImageId ?? this.headerImageId,
      iconImageId: input.iconImageId ?? this.iconImageId,
    })
  }
}
