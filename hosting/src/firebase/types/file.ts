import firebase from 'firebase/app'

export type File = {
  bucketName: string
  contentType: string
  createdAt: firebase.firestore.Timestamp
  filePath: string
  id: string
  size: number
  updatedAt: firebase.firestore.Timestamp
}
