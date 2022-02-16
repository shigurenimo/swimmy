import { z } from "zod"

const zProps = z.string().min(8).max(40)

/**
 * ID
 */
export class Id {
  constructor(public value: z.infer<typeof zProps>) {
    zProps.parse(value)
    Object.freeze(this)
  }
}
