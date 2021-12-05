import { AppReaction } from "integrations/interface/types/appReaction"

export type AppResponse = {
  id: string
  createdAt: Date
  text: string | null
  likesCount: number
  repliesCount: number
  reactions: AppReaction[]
  isDeleted: boolean
}
