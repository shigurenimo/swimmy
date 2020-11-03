import firebase from 'firebase/app'

export type Doc = {
  id: string
  createdAt: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
}
