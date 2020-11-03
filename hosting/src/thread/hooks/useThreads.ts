import firebase from 'firebase/app'
import { useEffect, useState } from 'react'
import { collectionData } from 'rxfire/firestore'
import { toField } from '../../common/hooks/toField'
import { THREADS } from '../../firebase/constants/collection'
import { DESC } from '../../firebase/constants/order'
import { Post } from '../../firebase/types/post'
import { SearchOrderBy } from '../../post/types/searchOrderBy'

let __POSTS__: Post[] = []

let __POSTS__LIKE_COUNT: Post[] = []

let __POSTS__REPLY_COUNT: Post[] = []

export const useThreads = (limit: number, orderBy: SearchOrderBy): [Post[]] => {
  const [posts, setPosts] = useState(() => {
    switch (orderBy) {
      case 'like_count':
        return __POSTS__LIKE_COUNT
      case 'reply_count':
        return __POSTS__REPLY_COUNT
      default:
        return __POSTS__
    }
  })

  useEffect(() => {
    const field = toField(orderBy)

    const subscription = collectionData<Post>(
      firebase.firestore().collection(THREADS).limit(limit).orderBy(field, DESC)
    ).subscribe((_posts) => {
      setPosts(_posts)
    })

    return () => subscription.unsubscribe()
  }, [limit, orderBy])

  switch (orderBy) {
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
