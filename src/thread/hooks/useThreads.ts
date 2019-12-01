import { firestore } from 'firebase/app'
import { useEffect, useState } from 'react'
import { collectionData } from 'rxfire/firestore'
import { POSTS_AS_THREAD } from '../../firestore/constants/collection'
import { DESC } from '../../firestore/constants/order'
import { Post } from '../../firestore/types/post'
import { OrderBy } from '../types/orderBy'

let __POSTS__CREATED_AT: Post[] = []

let __POSTS__LIKE_COUNT: Post[] = []

let __POSTS__REPLY_POST_COUNT: Post[] = []

export const useThreads = (limit: number, orderBy: OrderBy): [Post[]] => {
  const [posts, setPosts] = useState(() => {
    switch (orderBy) {
      case 'likeCount':
        return __POSTS__LIKE_COUNT
      case 'replyPostCount':
        return __POSTS__REPLY_POST_COUNT
      default:
        return __POSTS__CREATED_AT
    }
  })

  useEffect(() => {
    const subscription = collectionData<Post>(
      firestore()
        .collection(POSTS_AS_THREAD)
        .limit(limit)
        .orderBy(orderBy, DESC)
    ).subscribe(_posts => {
      setPosts(_posts)
    })
    return () => subscription.unsubscribe()
  }, [limit, orderBy])

  switch (orderBy) {
    case 'likeCount': {
      __POSTS__LIKE_COUNT = posts
      break
    }
    case 'replyPostCount': {
      __POSTS__REPLY_POST_COUNT = posts
      break
    }
    default: {
      __POSTS__CREATED_AT = posts
    }
  }

  return [posts]
}
