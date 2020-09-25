import { auth, firestore } from 'firebase-admin'
import { region } from 'firebase-functions'
import { USERS } from './constants/collection'
import { US_CENTRAL1 } from './constants/region'

const handler = async (userRecord: auth.UserRecord) => {
  const userRef = firestore()
    .collection(USERS)
    .doc(userRecord.uid)

  await userRef.delete()
}

module.exports = region(US_CENTRAL1)
  .auth.user()
  .onDelete(handler)
