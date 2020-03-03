import { firestore } from 'firebase'
import { useEffect, useState } from 'react'
import { collectionData } from 'rxfire/firestore'
import { POSTS_AS_ANONYM } from '../../firestore/constants/collection'
import { Post } from '../../firestore/types/post'
import { toWhereOneDay } from '../helpers/toWhereOneDay'

let __STATE__: Post[] = []

export const useLogPosts = (
  year: number,
  month: number,
  date: number
): [Post[]] => {
  const [posts, setPosts] = useState(__STATE__)

  useEffect(() => {
    const [startTime, endTime] = toWhereOneDay(year, month, date)

    const subscription = collectionData<Post>(
      firestore()
        .collection(POSTS_AS_ANONYM)
        .where('createdAt', '>', startTime)
        .where('createdAt', '<', endTime)
    ).subscribe(_posts => {
      console.log(posts)
      setPosts(_posts)
    })

    return () => subscription.unsubscribe()
  }, [year, month, date, posts])

  __STATE__ = posts

  return [posts]
}
