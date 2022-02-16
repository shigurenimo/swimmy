import { z } from "zod"

const zProps = z.union([
  z.literal("ADMIN"),
  z.literal("SYSTEM"),
  z.literal("USER"),
])

/**
 * ユーザーの権限
 */
export class UserRole {
  constructor(public value: z.infer<typeof zProps>) {
    zProps.parse(value)
    Object.freeze(this)
  }
}
