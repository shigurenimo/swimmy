import { auth, firestore } from 'firebase-admin'
import { region } from 'firebase-functions'
import { USERS } from './constants/collection'
import { US_CENTRAL1 } from './constants/region'
import { createUser } from './helpers/createUser'

const handler = async (userRecord: auth.UserRecord) => {
  if (!userRecord.email) return

  const isSwUser = !!userRecord.email.includes('@swimmy.io')

  const user = createUser({
    userId: userRecord.uid,
    username: isSwUser
      ? userRecord.email.replace('@swimmy.io', '')
      : userRecord.uid,
  })

  const userRef = firestore()
    .collection(USERS)
    .doc(userRecord.uid)

  await userRef.set(user)
}

module.exports = region(US_CENTRAL1)
  .auth.user()
  .onCreate(handler)
