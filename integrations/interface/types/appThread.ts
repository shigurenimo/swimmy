import { AppReaction } from "integrations/interface/types/appReaction"

export type AppThread = {
  id: string
  createdAt: Date
  text: string | null
  fileIds: string[]
  likesCount: number
  repliesCount: number
  reactions: AppReaction[]
  isDeleted: boolean
}
