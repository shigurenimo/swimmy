import { z } from "zod"

export const createReactionInputSchema = z.object({
  text: z.string().trim().min(1).max(8),
})

export type CreateReactionInput = z.infer<typeof createReactionInputSchema>
