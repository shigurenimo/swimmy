import { z } from "zod"

const zProps = z.string().max(128)

/**
 * 紹介文
 *
 * ユーザーの紹介文に使われる。
 *
 * - 文字列である
 * - 80文字まで
 *
 * @example
 * ```
 * const biography = new Biography("Hello")
 * ```
 */
export class Biography {
  constructor(public value: z.infer<typeof zProps>) {
    zProps.parse(value)
    Object.freeze(this)
  }
}
