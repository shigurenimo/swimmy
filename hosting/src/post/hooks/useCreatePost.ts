import firebase from 'firebase/app'
import { useEffect, useState } from 'react'
import { httpsCallable } from 'rxfire/functions'
import { CREATE_POST } from '../../core/constants/functions'
import { US_CENTRAL1 } from '../../core/constants/region'
import { CreatePostData } from '../../core/types/createPostData'

export const useCreatePost = (
  data: CreatePostData,
  next: () => void
): [boolean, () => void] => {
  const [loading, setLoading] = useState(false)

  const createPost = httpsCallable<CreatePostData, void>(
    firebase.app().functions(US_CENTRAL1),
    CREATE_POST
  )

  useEffect(() => {
    if (!loading) return

    const subscription = createPost(data).subscribe(
      () => {
        firebase.analytics().logEvent('tap_to_post')
        setLoading(false)
        next()
      },
      (error) => {
        firebase.analytics().logEvent('exception', {
          description: 'faild to post',
          fatal: true,
          error: error.toString(),
        })
        console.error(error)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  const run = () => setLoading(true)

  return [loading, run]
}
