import { auth } from 'firebase-admin'
import { https } from 'firebase-functions'

export const getUserRecord = (context: https.CallableContext) => {
  return typeof context.auth === 'undefined'
    ? null
    : auth().getUser(context.auth.uid)
}
