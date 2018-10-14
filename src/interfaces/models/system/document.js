import { firestore } from 'firebase-admin'

export interface Document {
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
}
