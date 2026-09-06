import { z } from "zod"
import { postNodeSchema } from "@/interface/api/post-node-schema"

export const postsPageSchema = z.object({
  totalCount: z.number(),
  pageInfo: z.object({
    endCursor: z.string().nullable(),
    hasNextPage: z.boolean(),
  }),
  nodes: z.array(postNodeSchema),
})

export type PostsPage = z.infer<typeof postsPageSchema>
