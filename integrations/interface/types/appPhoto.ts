export type AppPhoto = {
  id: string
  createdAt: Date
  text: string | null
  likesCount: number
  repliesCount: number
  reactions: {
    id: string
    text: string
    count: number
    isConnected: boolean
  }[]
  fileIds: string[]
  isDeleted: boolean
}
