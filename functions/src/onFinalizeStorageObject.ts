import { firestore } from 'firebase-admin'
import { region } from 'firebase-functions'
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage'
import { FILES } from './constants/collection'
import { US_CENTRAL1 } from './constants/region'
import { createFile } from './helpers/createFile'
import { toFileName } from './utils/toFileName'

const handler = async (object: ObjectMetadata) => {
  if (typeof object.name !== 'string') {
    throw new Error('object.name not found')
  }

  const fileId = toFileName(object.name)

  const file = createFile({
    id: fileId,
    bucketName: object.bucket,
    contentType: object.contentType as string,
    filePath: object.name,
    size: Number(object.size),
  })

  const fileRef = firestore()
    .collection(FILES)
    .doc(fileId)

  await fileRef.set(file)
}

module.exports = region(US_CENTRAL1)
  .storage.object()
  .onFinalize(handler)
