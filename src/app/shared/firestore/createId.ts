import { firestore } from 'firebase/app'

export const createId = (): string => {
  return firestore()
    .collection('sample')
    .doc().id
}
