import { firestore } from 'firebase-admin'
import { EventContext, region } from 'firebase-functions'
import { LIKES } from './constants/collection'
import { US_CENTRAL1 } from './constants/region'
import { detectDuplicateEvent } from './helpers/detectDuplicateEvent'

const path = `{collectionId}/{docId}/${LIKES}/{userId}`

const handler = async (
  _: firestore.DocumentSnapshot,
  context: EventContext
) => {
  detectDuplicateEvent(context)

  const { collectionId, docId } = context.params

  const likeCount = firestore.FieldValue.increment(-1)

  await firestore().collection(collectionId).doc(docId).update({ likeCount })
}

module.exports = region(US_CENTRAL1).firestore.document(path).onDelete(handler)
