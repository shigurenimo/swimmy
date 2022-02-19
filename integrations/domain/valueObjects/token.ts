import { z } from "zod"

const zValue = z.string().min(8).max(2048)

/**
 * トークン
 */
export class Token {
  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
    Object.freeze(this)
  }
}
