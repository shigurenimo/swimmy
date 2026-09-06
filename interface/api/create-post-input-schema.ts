import { z } from "zod"
import { idSchema } from "@/interface/api/id-schema"

export const createPostInputSchema = z.object({
  text: z.string().trim().min(1).max(280),
  fileIds: z.array(idSchema).max(4),
  threadId: idSchema.nullable(),
})

export type CreatePostInput = z.infer<typeof createPostInputSchema>
