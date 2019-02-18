import { firestore } from 'firebase/app'
import { Id } from './id'

export interface Doc extends Id {
  createdAt: firestore.Timestamp
  updatedAt: firestore.Timestamp
}
