import firebase from 'firebase/app'
import { useEffect, useState } from 'react'
import { httpsCallable } from 'rxfire/functions'
import { CREATE_POST } from '../../firebase/constants/functions'
import { US_CENTRAL1 } from '../../firebase/constants/region'
import { CreatePostData } from '../../firebase/types/createPostData'

export const useCreateResponse = (
  data: CreatePostData,
  onNext: () => void
): [boolean, () => void] => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!loading) return

    const createPost = httpsCallable<CreatePostData, void>(
      firebase.app().functions(US_CENTRAL1),
      CREATE_POST
    )

    const subscription = createPost(data).subscribe(
      () => {
        firebase.analytics().logEvent('tap_to_reply')
        setLoading(false)
        onNext()
      },
      (error) => {
        firebase.analytics().logEvent('exception', {
          description: 'faild to reply',
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
