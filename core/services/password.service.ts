import { compare, hash } from "bcrypt-ts"
import { HashedPassword, Password } from "core/valueObjects"

export const VerifyResult = {
  VALID: Symbol("VALID"),
  INVALID: Symbol("INVALID"),
} as const

/**
 * パスワード
 */
export class PasswordService {
  /**
   * パスワードをハッシュ化する
   * @param password
   * @returns
   */
  async hashPassword(password: Password) {
    const improvedHash = await hash(password.value, 10)

    return new HashedPassword(improvedHash)
  }

  /**
   * パスワードを検証する
   * @param hashedPassword
   * @param password
   * @returns
   */
  async verifyPassword(hashedPassword: HashedPassword, password: Password) {
    try {
      const isValid = await compare(password.value, hashedPassword.value)

      return isValid ? VerifyResult.VALID : VerifyResult.INVALID
    } catch (error) {
      return error
    }
  }

  /**
   * パスワードが間違っているかどうか
   * @param result
   * @returns
   */
  isInvalid(result: symbol) {
    return result !== VerifyResult.VALID
  }
}
