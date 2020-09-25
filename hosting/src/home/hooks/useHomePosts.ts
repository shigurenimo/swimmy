import { firestore } from 'firebase/app'
import { useEffect, useState } from 'react'
import { collectionData } from 'rxfire/firestore'
import { FEEDS } from '../../firestore/constants/collection'
import { DESC } from '../../firestore/constants/order'
import { Post } from '../../firestore/types/post'

let __POSTS__: Post[] = []

export const useHomePosts = (limit: number): [Post[]] => {
  const [posts, setPosts] = useState(__POSTS__)

  useEffect(() => {
    const subscription = collectionData<Post>(
      firestore()
        .collection(FEEDS)
        .limit(limit)
        .orderBy('createdAt', DESC)
    ).subscribe(_posts => {
      setPosts(_posts)
    })

    return () => subscription.unsubscribe()
  }, [limit])

  __POSTS__ = posts

  return [posts]
}
