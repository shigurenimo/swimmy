import * as z from "zod"

export const zReactionText = z.string().min(1).max(8)

export type ReactionTextValue = z.infer<typeof zReactionText>

/**
 * 投稿のテキスト
 */
export class ReactionText {
  constructor(public value: ReactionTextValue) {
    zReactionText.parse(value)
    Object.freeze(this)
  }
}
