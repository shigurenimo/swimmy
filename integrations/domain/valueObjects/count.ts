import { z } from "zod"

const zProps = z.number().min(0)

/**
 * 集計した値
 * @deprecated
 *
 * - 数字である
 * - 0以上
 */
export class Count {
  constructor(public value: z.infer<typeof zProps>) {
    zProps.parse(value)
    Object.freeze(this)
  }
}
