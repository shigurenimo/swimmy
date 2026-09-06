import { z } from "zod"
import { reactionNodeSchema } from "@/interface/api/reaction-node-schema"

export const postNodeSchema = z.object({
  id: z.string(),
  createdAt: z.number(),
  text: z.string().nullable(),
  fileIds: z.array(z.string()),
  likesCount: z.number(),
  repliesCount: z.number(),
  reactions: z.array(reactionNodeSchema),
  isDeleted: z.boolean(),
})

export type PostNode = z.infer<typeof postNodeSchema>
