import axios from 'axios'
import { DELETE } from '../constants/method'

export const deleteImageURL = async (filePath: string) => {
  const { projectId } = JSON.parse(process.env.FIREBASE_CONFIG as string)

  const bucketName = `${projectId}.appspot.com`

  await axios({
    method: DELETE,
    url: `https://${projectId}.appspot.com/images`,
    data: { bucketName, filePath },
    headers: { 'Content-Type': 'application/json' },
  })

  return null
}
