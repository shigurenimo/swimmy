import { Timestamp } from 'firebase/firestore'

export type Post = {
  createdAt: Timestamp
  fileIds: string[]
  id: string
  likeCount: number
  photoURLs: string[]
  replyPostCount: number
  replyPostId: string | null
  text: string
  updatedAt: Timestamp
}
