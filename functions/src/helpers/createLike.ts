import { Like } from '../types/like'
import { systemFields } from '../utils/systemFIelds'

type Input = {
  id: string
  collectionId: string
  docId: string
  ownerId: string
}

export const createLike = (input: Input): Like => {
  return {
    ...systemFields(input.id),
    collectionId: input.collectionId,
    docId: input.docId,
    ownerId: input.ownerId,
    docOwnerId: null,
  }
}
