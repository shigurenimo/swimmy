import { z } from "zod"

const zProps = z.string().min(1).max(8)

/**
 * 投稿のテキスト
 */
export class ReactionText {
  constructor(public value: z.infer<typeof zProps>) {
    zProps.parse(value)
    Object.freeze(this)
  }
}
