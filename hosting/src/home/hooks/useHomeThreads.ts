import firebase from 'firebase/app'
import { useEffect, useState } from 'react'
import { collectionData } from 'rxfire/firestore'
import { THREADS } from '../../core/constants/collection'
import { DESC } from '../../core/constants/order'
import { Post } from '../../core/types/post'

let __POSTS__: Post[] = []

export const useHomeThreads = (limit: number): [Post[]] => {
  const [posts, setPosts] = useState(__POSTS__)

  useEffect(() => {
    const subscription = collectionData<Post>(
      firebase
        .firestore()
        .collection(THREADS)
        .limit(limit)
        .orderBy('updatedAt', DESC)
    ).subscribe((_posts) => {
      setPosts(_posts)
    })
    return () => subscription.unsubscribe()
  }, [limit])

  __POSTS__ = posts

  return [posts]
}
