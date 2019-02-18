import { Owner } from './owner'

export interface Ownable {
  owner: Owner | null
  ownerId: string | null
}
