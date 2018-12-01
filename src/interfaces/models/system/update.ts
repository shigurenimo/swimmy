import { firestore } from 'firebase/app'

export interface Update {
  updatedAt: firestore.Timestamp
}
