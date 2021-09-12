import { Timestamp } from 'firebase/firestore'

export type File = {
  bucketName: string
  contentType: string
  createdAt: Timestamp
  filePath: string
  id: string
  size: number
  updatedAt: Timestamp
}
