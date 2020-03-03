import { firestore } from 'firebase/app'
import { useEffect, useState } from 'react'
import { collectionData } from 'rxfire/firestore'
import { map } from 'rxjs/operators'
import { POSTS_AS_THREAD } from '../../firestore/constants/collection'
import { Post } from '../../firestore/types/post'
import { toWhereHalfMonth } from '../../logs/helpers/toWhereHarfMonth'

let __POSTS__: Post[] = []

export const useSearchThreads = (
  year: number,
  month: number,
  early: boolean
): [Post[], boolean] => {
  const [loading, setLoading] = useState(__POSTS__.length === 0)

  const [posts, setPosts] = useState(__POSTS__)

  useEffect(() => {
    const [startTime, endTime] = toWhereHalfMonth(year, month, early)

    const subscription = collectionData<Post>(
      firestore()
        .collection(POSTS_AS_THREAD)
        .limit(500)
        .where('createdAt', '>', startTime)
        .where('createdAt', '<', endTime)
    )
      .pipe(
        map(_posts => {
          if (_posts.length > 100) {
            return _posts.filter(post => post.replyPostCount > 4)
          }

          if (_posts.length > 80) {
            return _posts.filter(post => post.replyPostCount > 3)
          }

          if (_posts.length > 40) {
            return _posts.filter(post => post.replyPostCount > 2)
          }

          if (_posts.length > 20) {
            return _posts.filter(post => post.replyPostCount > 1)
          }

          return _posts
        }),
        map(_posts => {
          return _posts.sort((a, b) => {
            return b.replyPostCount - a.replyPostCount
          })
        })
      )
      .subscribe(_posts => {
        setPosts(_posts)
        setLoading(false)
      })

    return () => subscription.unsubscribe()
  }, [year, month, early])

  __POSTS__ = posts

  return [posts, loading]
}
