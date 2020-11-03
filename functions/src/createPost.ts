import { firestore } from 'firebase-admin'
import { https, region } from 'firebase-functions'
import { INVALID_ARGUMENT } from './constants/code'
import { FEEDS, POSTS, RESPONSES, THREADS } from './constants/collection'
import { US_CENTRAL1 } from './constants/region'
import { createPost } from './helpers/createPost'
import { CreatePostData } from './types/createPostData'
import { CreatePostResult } from './types/createPostResult'
import { HealthCheckData } from './types/healthCheckData'
import { HealthCheckResult } from './types/healthCheckResult'
import { createId } from './utils/createId'
import { isEmptyText } from './utils/isEmptyText'

const handler = async (
  data: CreatePostData & HealthCheckData
): Promise<CreatePostResult | HealthCheckResult> => {
  if (data.healthCheck) return Date.now()

  if (!data.fileIds.length && isEmptyText(data.text)) {
    throw new https.HttpsError(INVALID_ARGUMENT, '')
  }

  const postId = createId()

  const post = await createPost({
    fileIds: data.fileIds,
    photoURLs: [],
    postId: postId,
    replyPostId: data.replyPostId,
    text: data.text,
  })

  await firestore().collection(POSTS).doc(postId).set(post)

  // if post is for replying

  if (post.replyPostId) {
    await firestore()
      .collection(THREADS)
      .doc(post.replyPostId)
      .collection(RESPONSES)
      .doc(postId)
      .set(post)
  }

  // if post is not for replying

  if (!post.replyPostId) {
    await firestore().collection(FEEDS).doc(postId).set(post)
  }

  return { postId: postId }
}

module.exports = region(US_CENTRAL1).https.onCall(handler)
