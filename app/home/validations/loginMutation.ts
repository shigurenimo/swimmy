import * as z from "zod"

export const zLoginMutation = z.object({
  idToken: z.string(),
})
