import { Document } from '../system/document'
import { Node } from '../system/node'
import { UserLink } from './userLink'

export interface User extends Node, Document {
  description: string
  displayName: string
  followeeCount: number
  followerCount: number
  links: UserLink[]
  photoURL: string
  username: string
  uid: string
}
