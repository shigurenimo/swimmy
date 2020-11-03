import firebase from 'firebase/app'
import { Id } from './id'

export type Doc = Id & {
  createdAt: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
}
