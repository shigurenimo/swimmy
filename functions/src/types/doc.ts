import { firestore } from 'firebase-admin'
import { Id } from './id'

export type Doc = Id & {
  createdAt: firestore.Timestamp
  updatedAt: firestore.Timestamp
}
