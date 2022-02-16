import { z } from "zod"

const zProps = z.string()

/**
 * パスワードハッシュ
 */
export class HashedPassword {
  constructor(public value: z.infer<typeof zProps>) {
    zProps.parse(value)
    Object.freeze(this)
  }
}
