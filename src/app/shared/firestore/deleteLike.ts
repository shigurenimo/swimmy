import { LIKES } from 'app/shared/constants/collection'
import { firestore } from 'firebase/app'
import { from } from 'rxjs'

export const deleteLike = ({
  collectionId,
  docId,
  userId
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
      .delete()
  )
}
