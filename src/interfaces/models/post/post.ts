import { Owner } from '../shared/owner'
import { Document } from '../system/document'
import { Node } from '../system/node'

export interface Post extends Node, Document {
  fileIds: string[]
  likeCount: number
  text: string
  owner: Owner | null
  ownerId: string | null
  photoURLs: string[]
  replyPostId: string | null
  replyPostCount: number
}
