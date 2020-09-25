import { firestore } from 'firebase'

export type File = {
  bucketName: string
  contentType: string
  createdAt: firestore.Timestamp
  filePath: string
  id: string
  size: number
  updatedAt: firestore.Timestamp
}
