import { Timestamp } from 'firebase/firestore'

export type Doc = {
  id: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
