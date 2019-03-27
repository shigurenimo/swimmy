import { Owner } from './owner'

export type Ownable = {
  owner: Owner | null
  ownerId: string | null
}
