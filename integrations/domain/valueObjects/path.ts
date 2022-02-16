import { z } from "zod"

const zProps = z.string().max(160)

/**
 * パス
 */
export class Path {
  constructor(public value: z.infer<typeof zProps>) {
    zProps.parse(value)
    Object.freeze(this)
  }
}
