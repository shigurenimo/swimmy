import { AppReaction } from "infrastructure/types"

export type AppResponse = {
  id: string
  createdAt: Date
  text: string | null
  fileIds: string[]
  likesCount: number
  repliesCount: number
  reactions: AppReaction[]
  isDeleted: boolean
}
