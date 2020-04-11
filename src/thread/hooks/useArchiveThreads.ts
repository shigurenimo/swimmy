import { firestore } from 'firebase/app'
import { useEffect, useState } from 'react'
import { collectionData } from 'rxfire/firestore'
import { map } from 'rxjs/operators'
import { POSTS_AS_THREAD } from '../../firestore/constants/collection'
import { Post } from '../../firestore/types/post'
import { toWhereHalfMonth } from '../../logs/helpers/toWhereHarfMonth'

let __POSTS__: Post[] = []

export const useArchiveThreads = (
  year: number,
  month: number
): [Post[], boolean] => {
  const [loading, setLoading] = useState(__POSTS__.length === 0)

  const [posts, setPosts] = useState(__POSTS__)

  useEffect(() => {
    const [startTime, endTime] = toWhereHalfMonth(year, month)

    const subscription = collectionData<Post>(
      firestore()
        .collection(POSTS_AS_THREAD)
        .limit(500)
        .where('createdAt', '>', startTime)
        .where('createdAt', '<', endTime)
    )
      .pipe(
        map(_posts => {
          return _posts
            .sort((a, b) => b.replyPostCount - a.replyPostCount)
            .filter((_, i) => i < 80)
        })
      )
      .subscribe(_posts => {
        setPosts(_posts)
        setLoading(false)
      })

    return () => subscription.unsubscribe()
  }, [year, month])

  __POSTS__ = posts

  return [posts, loading]
}
