import { z } from "zod"

const zProps = z
  .string()
  .max(32)
  .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)

/**
 * ユーザーネーム
 */
export class Username {
  constructor(public value: z.infer<typeof zProps>) {
    zProps.parse(value)
    Object.freeze(this)
  }
}
