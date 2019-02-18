import { app } from 'firebase/app'
import { CREATE_CHANGELOG } from '../constants/functions'
import { ASIA_NORTHEAST1 } from '../constants/region'
import { CreateChangelog } from '../interfaces/https/createChangelog'

export const createChangelog = (data: CreateChangelog) => {
  return app()
    .functions(ASIA_NORTHEAST1)
    .httpsCallable(CREATE_CHANGELOG)(data)
}
