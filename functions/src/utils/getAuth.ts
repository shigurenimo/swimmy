import { Owner } from '../types/owner'
import { https } from 'firebase-functions'

export const getAuth = (context: https.CallableContext): Owner | null => {
  if (typeof context.auth === 'undefined') return null

  return {
    uid: context.auth.uid,
    displayName: context.auth.token.name || null,
    photoURL: context.auth.token.picture || null,
  }
}
