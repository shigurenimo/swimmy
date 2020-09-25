import { Image } from '../types/image'
import { systemFields } from '../utils/systemFIelds'

type Input = {
  id: string
  imageURL: string
  bucketName: string
  filePath: string
}

export const createImage = (input: Input): Image => {
  return {
    ...systemFields(input.id),
    imageURL: input.imageURL,
    bucketName: input.bucketName,
    filePath: input.filePath,
  }
}
