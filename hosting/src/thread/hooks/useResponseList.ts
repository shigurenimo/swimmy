import {
  collection,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore'
import { useEffect } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { RESPONSES, THREADS } from 'src/core/constants/collection'
import { Post } from 'src/core/types/post'

export const useResponseList = (threadId: string) => {
  const ref = collection(getFirestore(), THREADS, threadId, RESPONSES)

  const q = query(ref, limit(120), orderBy('createdAt', 'asc'))

  const queryClient = useQueryClient()

  const queryKey = ref.path.split('/')

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (querySnap) => {
      queryClient.setQueryData(queryKey, () => {
        return querySnap.docs.map((doc) => {
          return doc.data()
        })
      })
    })

    return () => {
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey.join('/')])

  return useQuery(queryKey, async () => {
    const querySnap = await getDocs<Post>(q as any)

    return querySnap.docs.map((query) => {
      return query.data()
    })
  })
}
