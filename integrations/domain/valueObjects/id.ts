import { z } from "zod"

const zValue = z.string().min(8).max(40)

/**
 * ID
 */
export class Id {
  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
    Object.freeze(this)
  }
}
