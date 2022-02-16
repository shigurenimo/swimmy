import { z } from "zod"

const zProps = z.union([
  z.literal("FOLLOW"),
  z.literal("FRIENDSHIP"),
  z.literal("LIKE"),
  z.literal("QUOTATION"),
  z.literal("REPLY"),
])

/**
 * 通知の種類
 */
export class NotificationType {
  constructor(public value: z.infer<typeof zProps>) {
    zProps.parse(value)
    Object.freeze(this)
  }
}
