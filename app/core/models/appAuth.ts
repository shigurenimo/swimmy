import { IdTokenResult, User } from "firebase/auth"

type Props = {
  userId: string
  email: string | null
  idTokenResult: IdTokenResult
}

export class AppAuth {
  readonly userId!: string

  readonly email!: string

  static fromUser(user: User, idTokenResult: IdTokenResult): AppAuth {
    return new AppAuth({
      userId: user.uid,
      email: user.email,
      idTokenResult,
    })
  }

  constructor(readonly props: Props) {
    Object.assign(this, props)
  }
}
