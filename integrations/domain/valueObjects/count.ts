import { z } from "zod"

const zValue = z.number().min(0)

/**
 * 集計した値
 * @deprecated
 *
 * - 数字である
 * - 0以上
 */
export class Count {
  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
    Object.freeze(this)
  }
}
