import { firestore } from 'firebase-admin'
import { region } from 'firebase-functions'
import { POSTS } from './constants/collection'
import { US_CENTRAL1 } from './constants/region'
import { toDateText } from './helpers/toDateText'
import { isPhoto } from './modules/post/isPhoto'
import { isThread } from './modules/post/isThread'
import { Post } from './types/post'
import { systemFields } from './utils/systemFIelds'

const handler = async () => {
  const now = new Date()

  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const createdAt = firestore.Timestamp.fromDate(date)

  const statisticId = toDateText(
    new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
  )

  const firstPostsQuerySnap = await firestore()
    .collection(POSTS)
    .where('createdAt', '<', createdAt)
    .get()

  const allPosts = firstPostsQuerySnap.docs.map(doc => doc.data() as Post)

  const allPhotos = allPosts.filter(isPhoto)

  const allThreads = allPosts.filter(isThread)

  const posts = allPosts.filter(post => {
    const d = post.createdAt.toDate()

    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    )
  })

  const threads = posts.filter(isThread)

  const photos = posts.filter(isPhoto)

  const statistic = {
    ...systemFields(statisticId),
    totalPhotoCount: allPhotos.length,
    totalPostCount: allPosts.length,
    totalThreadCount: allThreads.length,
    photoCount: photos.length,
    postCount: posts.length,
    threadCount: threads.length,
  }

  await firestore()
    .collection('sizes')
    .doc(statisticId)
    .set(statistic)
}

module.exports = region(US_CENTRAL1)
  .runWith({ timeoutSeconds: 540, memory: '2GB' })
  .pubsub.schedule('every 4 hours')
  .onRun(handler)
