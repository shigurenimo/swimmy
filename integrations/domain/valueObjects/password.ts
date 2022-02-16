import { SecurePassword } from "blitz"
import { HashedPassword } from "integrations/domain/valueObjects/hashedPassword"
import { z } from "zod"

const zProps = z.string().min(5).max(40)

/**
 * パスワード
 */
export class Password {
  constructor(public value: z.infer<typeof zProps>) {
    zProps.parse(value)
    Object.freeze(this)
  }

  /**
   * パスワードをハッシュ化する
   * @param password
   * @returns
   */
  async toHashPassword(password: Password) {
    const hashedPassword = await SecurePassword.hash(password.value)

    return new HashedPassword(hashedPassword)
  }
}
