import { firestore } from 'firebase/app'

export interface Document {
  createdAt: firestore.Timestamp
  updatedAt: firestore.Timestamp
}
