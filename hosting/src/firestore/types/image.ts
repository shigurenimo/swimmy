import { Doc } from './doc'

export type Image = Doc & {
  bucketName: string
  filePath: string
  imageURL: string
}
