import { firestore } from 'firebase-admin'
import { Doc } from './doc'

export type Stat = Doc & {
  postCount: number
  time: number
  timestamp: firestore.Timestamp
}
