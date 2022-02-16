import { AppReaction } from "integrations/types"

export type AppPhoto = {
  id: string
  createdAt: Date
  text: string | null
  likesCount: number
  repliesCount: number
  reactions: AppReaction[]
  fileIds: string[]
  isDeleted: boolean
}
