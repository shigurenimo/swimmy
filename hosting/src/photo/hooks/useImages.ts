import {
  collection,
  getFirestore,
  limit,
  orderBy,
  query,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { collectionData } from 'rxfire/firestore'
import { PHOTOS } from 'src/core/constants/collection'
import { DESC } from 'src/core/constants/order'
import { Post } from 'src/core/types/post'
import { toField } from 'src/core/utils/toField'
import { SearchOrderBy } from 'src/post/types/searchOrderBy'

let __POSTS__: Post[] = []

let __POSTS__LIKE_COUNT: Post[] = []

let __POSTS__REPLY_COUNT: Post[] = []

export const useImages = (
  _limit: number,
  _orderBy: SearchOrderBy
): [Post[]] => {
  const [posts, setPosts] = useState(() => {
    switch (_orderBy) {
      case 'like_count':
        return __POSTS__LIKE_COUNT
      case 'reply_count':
        return __POSTS__REPLY_COUNT
      default:
        return __POSTS__
    }
  })

  useEffect(() => {
    const field = toField(_orderBy)
    const ref = query<Post>(
      collection(getFirestore(), PHOTOS) as any,
      limit(_limit),
      orderBy(field, DESC)
    )
    const subscription = collectionData<Post>(ref).subscribe((_posts) => {
      setPosts(_posts)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [_limit, _orderBy])

  switch (_orderBy) {
    case 'like_count': {
      __POSTS__LIKE_COUNT = posts
      break
    }
    case 'reply_count': {
      __POSTS__REPLY_COUNT = posts
      break
    }
    default: {
      __POSTS__ = posts
    }
  }

  return [posts]
}
