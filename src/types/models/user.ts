import { Doc } from './doc'
import { UserLink } from './userLink'

export type User = Doc & {
  description: string
  displayName: string
  followeeCount: number
  followerCount: number
  links: UserLink[]
  photoURL: string
  username: string
  uid: string
}
