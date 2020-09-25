import { Doc } from './doc'

export type Like = Doc & {
  collectionId: string
  docId: string
  docOwnerId: string | null
  ownerId: string
}
