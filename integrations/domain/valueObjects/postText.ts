import { z } from "zod"

const zProps = z.string().min(1).max(280)

/**
 * 投稿のテキスト
 */
export class PostText {
  constructor(public value: z.infer<typeof zProps>) {
    zProps.parse(value)
    Object.freeze(this)
  }
}
