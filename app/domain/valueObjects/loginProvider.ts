import { z } from "zod"

const zValue = z.union([z.literal("GOOGLE_COM"), z.literal("PASSWORD")])

/**
 * ログイン・プロバイダ
 */
export class LoginProvider {
  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
    Object.freeze(this)
  }
}
