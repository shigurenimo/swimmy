import { firestore } from 'firebase/app'
import { useEffect, useState } from 'react'
import { collectionData } from 'rxfire/firestore'
import { POSTS, POSTS_AS_ANONYM } from '../../firestore/constants/collection'
import { ASC } from '../../firestore/constants/order'
import { Post } from '../../firestore/types/post'

let __POSTS__: Post[] = []

export const useResponses = (threadId: string): [Post[], boolean] => {
  const [posts, setPosts] = useState(__POSTS__)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    setPosts([])

    const subscription = collectionData<Post>(
      firestore()
        .collection(POSTS_AS_ANONYM)
        .doc(threadId)
        .collection(POSTS)
        .limit(120)
        .orderBy('createdAt', ASC)
    ).subscribe(_posts => {
      setPosts(_posts)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [threadId])

  __POSTS__ = posts

  return [posts, loading]
}
