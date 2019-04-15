import { app } from 'firebase/app'
import { from } from 'rxjs'
import { CREATE_POST_LIKE } from '../constants/functions'
import { US_CENTRAL1 } from '../constants/region'
import { CreatePostLikeData } from '../types/https/createPostLikeData'

export const createPostLike = (data: CreatePostLikeData) => {
  return from(
    app()
      .functions(US_CENTRAL1)
      .httpsCallable(CREATE_POST_LIKE)(data)
  )
}
