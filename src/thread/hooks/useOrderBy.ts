import { useLocation } from 'react-router'
import { OrderBy } from '../types/orderBy'

export const useOrderBy = (): OrderBy => {
  const location = useLocation()

  switch (location.search.replace('?order=', '')) {
    case 'createdAt':
      return 'createdAt'
    case 'likeCount':
      return 'likeCount'
    case 'replyPostCount':
      return 'replyPostCount'
    default:
      return 'createdAt'
  }
}
