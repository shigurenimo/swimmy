import { hash } from "bcrypt-ts"
import { z } from "zod"
import { HashedPassword } from "core/valueObjects/hashedPassword"

const zValue = z.string().min(5).max(40)

/**
 * パスワード
 */
export class Password {
  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
    Object.freeze(this)
  }

  /**
   * パスワードをハッシュ化する
   * @param password
   * @returns
   */
  async toHashPassword(password: Password) {
    const hashedPassword = await hash(password.value, 10)

    return new HashedPassword(hashedPassword)
  }
}
