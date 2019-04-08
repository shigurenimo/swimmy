import { app } from 'firebase/app'
import { from } from 'rxjs'
import { CREATE_POST } from '../constants/functions'
import { ASIA_NORTHEAST1 } from '../constants/region'
import { CreatePostData } from '../types/https/createPostData'

export const createPost = (data: CreatePostData) => {
  return from(
    app()
      .functions(ASIA_NORTHEAST1)
      .httpsCallable(CREATE_POST)(data)
  )
}
