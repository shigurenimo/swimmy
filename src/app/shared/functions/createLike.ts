import { app } from 'firebase/app'
import { httpsCallable } from 'rxfire/functions'
import { CREATE_POST_LIKE } from '../functions/constants/functions'
import { US_CENTRAL1 } from '../functions/constants/region'
import { CreateLikeData } from '../functions/types/createLikeData'
import { CreateLikeResult } from '../functions/types/createLikeResult'

export const createLike = () => {
  return httpsCallable<CreateLikeData, CreateLikeResult>(
    app().functions(US_CENTRAL1),
    CREATE_POST_LIKE
  )
}
