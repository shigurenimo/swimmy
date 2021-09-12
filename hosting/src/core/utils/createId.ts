import { doc, getFirestore } from 'firebase/firestore'

export const createId = (): string => {
  return doc(getFirestore(), 'sample', '-').id
}
