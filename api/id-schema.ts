import { z } from "zod"

export const idSchema = z.string().min(8).max(40)
