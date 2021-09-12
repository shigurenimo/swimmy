import { query } from '@firebase/firestore'
import { collection, getFirestore, limit, orderBy } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { collectionData } from 'rxfire/firestore'
import { FEEDS } from 'src/core/constants/collection'
import { DESC } from 'src/core/constants/order'
import { Post } from 'src/core/types/post'

let __POSTS__: Post[] = []

export const useHomePosts = (_limit: number): [Post[]] => {
  const [posts, setPosts] = useState(__POSTS__)

  useEffect(() => {
    const ref = query<Post>(
      collection(getFirestore(), FEEDS) as any,
      limit(_limit),
      orderBy('createdAt', DESC)
    )

    const subscription = collectionData<Post>(ref).subscribe((_posts) => {
      setPosts(_posts)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [_limit])

  __POSTS__ = posts

  return [posts]
}
