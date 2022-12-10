import { AppReaction } from "infrastructure/types"

export type AppPost = {
  id: string
  createdAt: Date
  text: string | null
  fileIds: string[]
  likesCount: number
  repliesCount: number
  reactions: AppReaction[]
  isDeleted: boolean
}
