import { analytics, app } from 'firebase/app'
import { useEffect, useState } from 'react'
import { httpsCallable } from 'rxfire/functions'
import { CREATE_POST } from '../../functions/constants/functions'
import { US_CENTRAL1 } from '../../functions/constants/region'
import { CreatePostData } from '../../functions/types/createPostData'
import { CreatePostResult } from '../../functions/types/createPostResult'

export const useCreateResponse = (
  data: CreatePostData,
  onNext: () => void
): [boolean, () => void] => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!loading) return

    const createPost = httpsCallable<CreatePostData, CreatePostResult>(
      app().functions(US_CENTRAL1),
      CREATE_POST
    )

    const subscription = createPost(data).subscribe(
      () => {
        analytics().logEvent('tap_to_reply')
        setLoading(false)
        onNext()
      },
      error => {
        analytics().logEvent('exception', {
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
