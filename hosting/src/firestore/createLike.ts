import { firestore } from 'firebase/app'
import { from } from 'rxjs'
import { LIKES } from './constants/collection'

export const createLike = ({
  collectionId,
  docId,
  userId,
}: {
  collectionId: string
  docId: string
  userId: string
}) => {
  return from(
    firestore()
      .collection(collectionId)
      .doc(docId)
      .collection(LIKES)
      .doc(userId)
      .set({
        collectionId,
        createdAt: firestore.FieldValue.serverTimestamp(),
        docId,
        id: userId,
        ownerId: userId,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      })
  )
}
