import { CREATE_POST_LIKE } from 'app/shared/functions/constants/functions'
import { US_CENTRAL1 } from 'app/shared/functions/constants/region'
import { CreateLikeData } from 'app/shared/functions/types/createLikeData'
import { CreateLikeResult } from 'app/shared/functions/types/createLikeResult'
import { app } from 'firebase/app'
import { httpsCallable } from 'rxfire/functions'

export const createLike = () => {
  return httpsCallable<CreateLikeData, CreateLikeResult>(
    app().functions(US_CENTRAL1),
    CREATE_POST_LIKE
  )
}
