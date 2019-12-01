import { OrderBy } from '../firestore/types/orderBy'
import { SearchOrderBy } from '../location/types/searchOrderBy'

export const toField = (param: SearchOrderBy): OrderBy => {
  switch (param) {
    case 'like_count':
      return 'likeCount'
    case 'reply_count':
      return 'replyPostCount'
    default:
      return 'createdAt'
  }
}
