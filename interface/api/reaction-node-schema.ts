import { z } from "zod"

export const reactionNodeSchema = z.object({
  id: z.string(),
  text: z.string(),
  count: z.number(),
  secretCount: z.number(),
  isConnected: z.boolean(),
})

export type ReactionNode = z.infer<typeof reactionNodeSchema>
