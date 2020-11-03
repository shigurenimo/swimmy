import axios from 'axios'
import { region } from 'firebase-functions'
import { US_CENTRAL1 } from './constants/region'
import { createFunctionURL } from './utils/createFunctionURL'

const handler = async () => {
  const names = ['createPost']

  const requests = names.map((name) => {
    return axios.request({
      url: createFunctionURL(US_CENTRAL1, name),
      method: 'OPTIONS',
    })
  })

  await Promise.all(requests)
}

module.exports = region(US_CENTRAL1)
  .pubsub.schedule('every 30 minutes')
  .onRun(handler)
