import {
  collection,
  getFirestore,
  limit,
  orderBy,
  query,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { collectionData } from 'rxfire/firestore'
import { THREADS } from 'src/core/constants/collection'
import { DESC } from 'src/core/constants/order'
import { Post } from 'src/core/types/post'

let __POSTS__: Post[] = []

export const useHomeThreads = (_limit: number): [Post[]] => {
  const [posts, setPosts] = useState(__POSTS__)

  useEffect(() => {
    const ref = query<Post>(
      collection(getFirestore(), THREADS) as any,
      limit(_limit),
      orderBy('updatedAt', DESC)
    )

    const subscription = collectionData<Post>(ref).subscribe((_posts) => {
      setPosts(_posts)
    })
    return () => subscription.unsubscribe()
  }, [_limit])

  __POSTS__ = posts

  return [posts]
}
