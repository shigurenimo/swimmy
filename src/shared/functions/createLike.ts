import { app } from 'firebase/app'
import { httpsCallable } from 'rxfire/functions'
import { CREATE_POST_LIKE } from './constants/functions'
import { US_CENTRAL1 } from './constants/region'
import { CreateLikeData } from './types/createLikeData'
import { CreateLikeResult } from './types/createLikeResult'

export const createLike = () => {
  return httpsCallable<CreateLikeData, CreateLikeResult>(
    app().functions(US_CENTRAL1),
    CREATE_POST_LIKE
  )
}
