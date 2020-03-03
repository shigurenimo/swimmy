import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { SearchOrderBy } from '../../location/types/searchOrderBy'

let __LIMIT__ = 12

let __LIMIT__LIKE_COUNT = 12

let __LIMIT__REPLY_COUNT = 12

export const useThreadsLimit = (
  orderBy: SearchOrderBy
): [number, Dispatch<SetStateAction<number>>] => {
  const [limit, setLimit] = useState(() => {
    switch (orderBy) {
      case 'like_count':
        return __LIMIT__LIKE_COUNT
      case 'reply_count':
        return __LIMIT__REPLY_COUNT
      default:
        return __LIMIT__
    }
  })

  useEffect(() => {
    switch (orderBy) {
      case 'like_count': {
        setLimit(__LIMIT__LIKE_COUNT)
        break
      }
      case 'reply_count': {
        setLimit(__LIMIT__REPLY_COUNT)
        break
      }
      default: {
        setLimit(__LIMIT__)
      }
    }
  }, [orderBy])

  useEffect(() => {
    return () => {
      switch (orderBy) {
        case 'like_count': {
          __LIMIT__LIKE_COUNT = limit
          break
        }
        case 'reply_count': {
          __LIMIT__REPLY_COUNT = limit
          break
        }
        default: {
          __LIMIT__ = limit
        }
      }
    }
  }, [limit, orderBy])

  return [limit, setLimit]
}
