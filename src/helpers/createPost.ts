import { app } from 'firebase/app'
import { CREATE_POST } from '../constants/functions'
import { ASIA_NORTHEAST1 } from '../constants/region'
import { CreatePostData } from '../types/https/createPostData'

export const createPost = (data: CreatePostData) => {
  return app()
    .functions(ASIA_NORTHEAST1)
    .httpsCallable(CREATE_POST)(data)
}
