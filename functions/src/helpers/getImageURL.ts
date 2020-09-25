import axios from 'axios'
import { POST } from '../constants/method'

export const getImageURL = async (filePath: string) => {
  const { projectId } = JSON.parse(process.env.FIREBASE_CONFIG as string)

  const bucketName = `${projectId}.appspot.com`

  const res = await axios({
    method: POST,
    url: `https://${projectId}.appspot.com/images`,
    data: { bucketName, filePath },
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.data) {
    return null
  }

  return res.data.data as string
}
