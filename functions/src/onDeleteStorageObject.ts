import { firestore } from 'firebase-admin'
import { EventContext, region } from 'firebase-functions'
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage'
import { FILES } from './constants/collection'
import { US_CENTRAL1 } from './constants/region'
import { detectDuplicateEvent } from './helpers/detectDuplicateEvent'
import { toFileName } from './utils/toFileName'

const handler = async (object: ObjectMetadata, context: EventContext) => {
  detectDuplicateEvent(context)

  if (typeof object.name !== 'string') {
    throw new Error('object.name not found')
  }

  const fileId = toFileName(object.name)

  const fileRef = firestore()
    .collection(FILES)
    .doc(fileId)

  const file = await fileRef.get()

  if (file.exists) {
    await fileRef.delete()
  }
}

module.exports = region(US_CENTRAL1)
  .storage.object()
  .onDelete(handler)
