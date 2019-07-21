import { CREATE_POST } from 'app/shared/functions/constants/functions'
import { US_CENTRAL1 } from 'app/shared/functions/constants/region'
import { CreatePostData } from 'app/shared/functions/types/createPostData'
import { CreatePostResult } from 'app/shared/functions/types/createPostResult'
import { app } from 'firebase/app'
import { httpsCallable } from 'rxfire/functions'

export const createPost = () => {
  return httpsCallable<CreatePostData, CreatePostResult>(
    app().functions(US_CENTRAL1),
    CREATE_POST
  )
}
