import { app } from 'firebase/app'
import { httpsCallable } from 'rxfire/functions'
import { CREATE_POST } from '../functions/constants/functions'
import { US_CENTRAL1 } from '../functions/constants/region'
import { CreatePostData } from '../functions/types/createPostData'
import { CreatePostResult } from '../functions/types/createPostResult'

export const createPost = () => {
  return httpsCallable<CreatePostData, CreatePostResult>(
    app().functions(US_CENTRAL1),
    CREATE_POST
  )
}
