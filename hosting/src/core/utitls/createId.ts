import firebase from 'firebase/app'

export const createId = (): string => {
  return firebase.firestore().collection('sample').doc().id
}
