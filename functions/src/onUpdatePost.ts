import { firestore } from 'firebase-admin'
import { Change, EventContext, region } from 'firebase-functions'
import {
  FEEDS,
  PHOTOS,
  POSTS,
  RESPONSES,
  THREADS,
} from './constants/collection'
import { US_CENTRAL1 } from './constants/region'
import { detectDuplicateEvent } from './helpers/detectDuplicateEvent'
import { Post } from './types/post'

const path = `${POSTS}/{postId}`

const handler = async (
  change: Change<firestore.DocumentSnapshot>,
  context: EventContext
) => {
  detectDuplicateEvent(context)

  const post = change.after.data() as Post

  const postRef = firestore().collection(FEEDS).doc(post.id)

  await postRef.set(post)

  if (post.replyPostId) {
    await firestore()
      .collection(THREADS)
      .doc(post.replyPostId)
      .collection(RESPONSES)
      .doc(post.id)
      .set(post)
  }

  if (!post.replyPostId) {
    await firestore().collection(FEEDS).doc(post.id).set(post)
  }

  if (!post.replyPostId && post.replyPostCount !== 0 && post.text !== '') {
    await firestore().collection(THREADS).doc(post.id).set(post)
  }

  if (!post.replyPostId && post.fileIds.length !== 0) {
    await firestore().collection(PHOTOS).doc(post.id).set(post)
  }
}

module.exports = region(US_CENTRAL1).firestore.document(path).onUpdate(handler)
