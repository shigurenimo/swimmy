import { firestore } from 'firebase-admin'

export type Update = { updatedAt: firestore.Timestamp }
