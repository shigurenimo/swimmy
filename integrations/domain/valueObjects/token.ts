import * as z from "zod"

export const zToken = z.string().min(8).max(2048)

export type TokenValue = z.infer<typeof zToken>

/**
 * トークン
 */
export class Token {
  constructor(public value: TokenValue) {
    zToken.parse(value)
    Object.freeze(this)
  }
}
