import { firestore } from 'firebase/app'
import { Id } from './id'

export type Doc = Id & {
  createdAt: firestore.Timestamp
  updatedAt: firestore.Timestamp
}
