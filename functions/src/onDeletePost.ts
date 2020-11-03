import { firestore } from 'firebase-admin'
import { EventContext, region } from 'firebase-functions'
import {
  FEEDS,
  FILES,
  PHOTOS,
  POSTS,
  RESPONSES,
  THREADS,
} from './constants/collection'
import { US_CENTRAL1 } from './constants/region'
import { detectDuplicateEvent } from './helpers/detectDuplicateEvent'
import { Post } from './types/post'
import { unflatten } from './utils/unflatten'

const path = `${POSTS}/{postId}`

const handler = async (
  snapshot: firestore.DocumentSnapshot,
  context: EventContext
) => {
  detectDuplicateEvent(context)

  const post = snapshot.data() as Post

  for (const fileId of post.fileIds) {
    await firestore().collection(FILES).doc(fileId).delete()
  }

  if (post.replyPostId) {
    await firestore()
      .collection(POSTS)
      .doc(post.replyPostId)
      .update({ replyPostCount: firestore.FieldValue.increment(-1) })
  }

  if (!post.replyPostId) {
    await firestore().collection(FEEDS).doc(post.id).delete()
  }

  if (!post.replyPostId && post.replyPostCount !== 0 && post.text !== '') {
    await firestore().collection(THREADS).doc(post.id).delete()

    const responsesQuerySnap = await firestore()
      .collection(THREADS)
      .doc(post.id)
      .collection(RESPONSES)
      .get()

    for (const snaps of unflatten(responsesQuerySnap.docs)) {
      const batch = firestore().batch()
      for (const snap of snaps) {
        batch.delete(snap.ref)
      }
      await batch.commit()
    }
  }

  if (!post.replyPostId && post.fileIds.length !== 0) {
    await firestore().collection(PHOTOS).doc(post.id).delete()
  }
}

module.exports = region(US_CENTRAL1).firestore.document(path).onDelete(handler)
