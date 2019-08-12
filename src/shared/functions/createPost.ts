import { app } from 'firebase/app'
import { httpsCallable } from 'rxfire/functions'
import { CREATE_POST } from './constants/functions'
import { US_CENTRAL1 } from './constants/region'
import { CreatePostData } from './types/createPostData'
import { CreatePostResult } from './types/createPostResult'

export const createPost = () => {
  return httpsCallable<CreatePostData, CreatePostResult>(
    app().functions(US_CENTRAL1),
    CREATE_POST
  )
}
