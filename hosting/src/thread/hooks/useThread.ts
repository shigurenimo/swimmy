import { doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore'
import { useEffect } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { FEEDS } from 'src/core/constants/collection'
import { Post } from 'src/core/types/post'

export const useThread = (threadId: string) => {
  const ref = doc(getFirestore(), FEEDS, threadId)

  const queryClient = useQueryClient()

  const queryKey = ref.path.split('/')

  useEffect(() => {
    const unsubscribe = onSnapshot(ref, (snap) => {
      queryClient.setQueryData(queryKey, () => {
        return snap.data()
      })
    })

    return () => {
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey.join('/')])

  return useQuery(queryKey, async () => {
    const snap = await getDoc<Post>(ref as any)

    return snap.data()
  })
}
