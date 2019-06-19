import { firestore } from 'firebase'

export type Statistic = {
  createdAt: firestore.Timestamp
  firstPostCount: number
  id: string
  imagePostCount: number
  likeCount: number
  postCount: number
  responsePostCount: number
  threadPostCount: number
  updatedAt: firestore.Timestamp
}
