import { Doc } from './doc'

export type File = Doc & {
  bucketName: string
  contentType: string
  filePath: string
  size: number
}
