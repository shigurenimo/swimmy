import { z } from "zod"

const zProps = z.string().url()

/**
 * URL
 */
export class Url {
  constructor(public value: z.infer<typeof zProps>) {
    zProps.parse(value)
    Object.freeze(this)
  }
}
