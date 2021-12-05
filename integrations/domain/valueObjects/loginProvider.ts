import * as z from "zod"

export const zLoginProvider = z.union([
  z.literal("GOOGLE_COM"),
  z.literal("PASSWORD"),
])

export type LoginProviderValue = z.infer<typeof zLoginProvider>

/**
 * ログイン・プロバイダ
 */
export class LoginProvider {
  constructor(public value: LoginProviderValue) {
    zLoginProvider.parse(value)
    Object.freeze(this)
  }
}
