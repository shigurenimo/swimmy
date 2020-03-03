import { useEffect, useState } from 'react'
import { createPost } from '../../functions/createPost'
import { CreatePostData } from '../../functions/types/createPostData'

export const useCreateResponse = (
  data: CreatePostData,
  onNext: () => void
): [boolean, () => void] => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!loading) return
    const subscription = createPost()(data).subscribe(
      () => {
        setLoading(false)
        onNext()
      },
      err => {
        console.error(err)
        setLoading(false)
      }
    )
    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  const run = () => setLoading(true)

  return [loading, run]
}
