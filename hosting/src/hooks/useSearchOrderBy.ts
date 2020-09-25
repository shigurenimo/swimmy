import { useLocation } from 'react-router-dom'
import { SearchOrderBy } from '../location/types/searchOrderBy'

export const useSearchOrderBy = (): SearchOrderBy => {
  const location = useLocation()

  switch (location.search.replace('?order=', '')) {
    case 'like_count':
      return 'like_count'
    case 'reply_count':
      return 'reply_count'
    default:
      return 'created_at'
  }
}
