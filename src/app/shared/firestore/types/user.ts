import { Doc } from 'app/shared/firestore/types/doc'
import { UserLink } from 'app/shared/firestore/types/userLink'

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
