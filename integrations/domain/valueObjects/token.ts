import { z } from "zod"

const zProps = z.string().min(8).max(2048)

/**
 * トークン
 */
export class Token {
  constructor(public value: z.infer<typeof zProps>) {
    zProps.parse(value)
    Object.freeze(this)
  }
}
