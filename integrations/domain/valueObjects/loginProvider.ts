import { z } from "zod"

const zProps = z.union([z.literal("GOOGLE_COM"), z.literal("PASSWORD")])

/**
 * ログイン・プロバイダ
 */
export class LoginProvider {
  constructor(public value: z.infer<typeof zProps>) {
    zProps.parse(value)
    Object.freeze(this)
  }
}
