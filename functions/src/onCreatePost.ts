import { firestore } from 'firebase-admin'
import { EventContext, region } from 'firebase-functions'
import { PHOTOS, POSTS } from './constants/collection'
import { US_CENTRAL1 } from './constants/region'
import { detectDuplicateEvent } from './helpers/detectDuplicateEvent'
import { Post } from './types/post'

const path = `${POSTS}/{postId}`

const handler = async (
  snapshot: firestore.DocumentSnapshot,
  context: EventContext
) => {
  detectDuplicateEvent(context)

  const post = snapshot.data() as Post

  // If this has replyPostId, Update replyPostCount of posts/{postId}

  if (post.replyPostId) {
    await firestore()
      .collection(POSTS)
      .doc(post.replyPostId)
      .update({
        replyPostCount: firestore.FieldValue.increment(1),
        updatedAt: firestore.Timestamp.now(),
      })
  }

  // If this has an photoURL, replicate this in posts-as-images/{postId}

  if (!post.replyPostId && post.fileIds.length !== 0) {
    await firestore().collection(PHOTOS).doc(post.id).set(post)
  }
}

module.exports = region(US_CENTRAL1).firestore.document(path).onCreate(handler)
