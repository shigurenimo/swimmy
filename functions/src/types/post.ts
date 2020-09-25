import { Doc } from './doc'

export type Post = Doc & {
  fileIds: string[]
  likeCount: number
  photoURLs: string[]
  replyPostId: string | null
  replyPostCount: number
  text: string
}
