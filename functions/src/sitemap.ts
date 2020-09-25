import { firestore } from 'firebase-admin'
import { region, Request, Response } from 'firebase-functions'
import { POSTS } from './constants/collection'
import { UPDATED_AT } from './constants/field'
import { DESC } from './constants/order'
import { US_CENTRAL1 } from './constants/region'

const handler = async (_: Request, response: Response) => {
  const postsQuerySnapshot = await firestore()
    .collection(POSTS)
    .orderBy(UPDATED_AT, DESC)
    .limit(1000)
    .get()

  const postIds = postsQuerySnapshot.docs.map(doc => doc.id)

  const hostname = 'https://swimmy.io'

  const urls: string[] = [
    hostname,
    `${hostname}/threads`,
    ...postIds.map(id => `${hostname}/threads/${id}`),
  ]

  const text = urls.join('\n')

  response.end(text)
}

module.exports = region(US_CENTRAL1).https.onRequest(handler)
