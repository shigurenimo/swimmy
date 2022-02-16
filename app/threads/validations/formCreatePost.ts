import { z } from "zod"

export const zFormCreatePost = z.object({
  text: z.string().min(1).max(128),
})
