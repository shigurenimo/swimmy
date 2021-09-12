import { captureException } from '@sentry/react'
import { getAnalytics, logEvent } from 'firebase/analytics'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { useMutation } from 'react-query'
import { CREATE_POST } from 'src/core/constants/functions'
import { CreatePostData } from 'src/core/types/createPostData'

export const useCreatePost = () => {
  const createPost = httpsCallable<CreatePostData, void>(
    getFunctions(),
    CREATE_POST
  )

  const mutation = useMutation(createPost, {
    onSuccess() {
      logEvent(getAnalytics(), 'tap_to_post')
    },
    onError(error) {
      captureException(error)
    },
  })

  return mutation
}
