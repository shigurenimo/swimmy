import { z } from "zod"

const zProps = z.string().max(12)

/**
 * ユーザー名
 */
export class Name {
  constructor(public value: z.infer<typeof zProps>) {
    zProps.parse(value)
    Object.freeze(this)
  }
}
