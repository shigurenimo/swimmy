import { Owner } from 'src/core/types/owner'

export type Ownable = {
  owner: Owner | null
  ownerId: string | null
}
