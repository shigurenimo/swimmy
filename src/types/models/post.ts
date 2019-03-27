import { Doc } from './doc'
import { Ownable } from './ownable'

export type Post = Doc &
  Ownable & {
    fileIds: string[]
    likeCount: number
    text: string
    photoURLs: string[]
    replyPostId: string | null
    replyPostCount: number
  }
