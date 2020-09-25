import { firestore } from 'firebase/app'
import { useEffect, useState } from 'react'
import { collectionData } from 'rxfire/firestore'
import { FEEDS, RESPONSES } from '../../firestore/constants/collection'
import { ASC } from '../../firestore/constants/order'
import { Post } from '../../firestore/types/post'

let __POSTS__: Post[] = []

export const useResponses = (threadId: string): [Post[], boolean] => {
  const [responses, setResponses] = useState(__POSTS__)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setResponses([])
    const subscription = collectionData<Post>(
      firestore()
        .collection(FEEDS)
        .doc(threadId)
        .collection(RESPONSES)
        .limit(4)
        .orderBy('createdAt', ASC)
    ).subscribe(_posts => {
      setResponses(_posts)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [threadId])

  __POSTS__ = responses

  return [responses, loading]
}
